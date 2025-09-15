import React from "react";
import reelIcon from "../../assets/movieReel.svg";
import popcornIcon from "../../assets/moviePopcorn.svg";
import clapperIcon from "../../assets/movieClapperBoard.svg";
import posterNotAvailable from "../../assets/posterNotAvailable.jpg";
import moviesLikeTheseLogo from "../../assets/moviesLikeTheseLogo.png";
import MovieRecommendation from "../MovieRecommendation/MovieRecommendation";
import InfoCard from "../InfoCard/InfoCard";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";
import { warmupBackend } from "../../utils/backendWarmup";

// Import environment variables
const MOVIE_RECOMMEND_BACKEND = import.meta.env.VITE_MOVIE_RECOMMEND_BACKEND;
const MOVIE_FETCH_BACKEND_ENDPOINT = import.meta.env
  .VITE_MOVIE_FETCH_BACKEND_ENDPOINT;
const MOVIE_RECOMMEND_BACKEND_ENDPOINT = import.meta.env
  .VITE_MOVIE_RECOMMEND_BACKEND_ENDPOINT;

const MovieSelector = () => {
  const [showSearch, setShowSearch] = React.useState(false);
  const [activeTileIndex, setActiveTileIndex] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [selectedTiles, setSelectedTiles] = React.useState([null, null, null]);
  const [selectedMovies, setSelectedMovies] = React.useState([]);
  const [isRecommendationLoading, setIsRecommendationLoading] =
    React.useState(false);
  const [recommendationError, setRecommendationError] = React.useState("");
  const [recommendations, setRecommendations] = React.useState([]);
  const [showColdStartMessage, setShowColdStartMessage] = React.useState(false);

  // Ref for loading animation to scroll to
  const loadingAnimationRef = React.useRef(null);
  // Ref for recommendations section to scroll to
  const recommendationsRef = React.useRef(null);

  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Warm up the backend when component mounts
  React.useEffect(() => {
    // Call the warmup function when component mounts
    warmupBackend();
  }, []);

  // Effect to scroll to recommendations when they are loaded
  React.useEffect(() => {
    if (recommendations.length > 0 && recommendationsRef.current) {
      // Small delay to ensure the component has rendered
      setTimeout(() => {
        recommendationsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [recommendations]);

  const handleOpenSearch = (index) => {
    setActiveTileIndex(index);
    setShowSearch(true);
  };
  const handleCloseSearch = () => setShowSearch(false);

  const buildSearchParam = (text) => {
    return text.trim().split(/\s+/).join("+");
  };

  const performSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsLoading(true);
    setError("");
    setResults([]);
    setShowColdStartMessage(false);

    // Set up a timer to show cold start message if search takes more than 2 seconds
    const coldStartTimer = setTimeout(() => {
      setShowColdStartMessage(true);
    }, 2000);

    try {
      const baseUrl =
        MOVIE_RECOMMEND_BACKEND + "/" + MOVIE_FETCH_BACKEND_ENDPOINT;

      // Format URL with query parameters
      const searchTerm = buildSearchParam(trimmed);
      const url = `${baseUrl}?searchTerm=${searchTerm}&type=movie`;

      const resp = await fetch(url, {
        method: "GET",
      });

      if (!resp.ok) {
        let apiErr = "Network error";
        try {
          const errJson = await resp.json();

          // Check for movie not found error (status 404 and error message)
          if (
            resp.status === 404 &&
            (errJson?.error === "Movie Not Found" ||
              (errJson?.Error &&
                errJson.Error.toLowerCase().includes("not found")))
          ) {
            apiErr =
              'Movie not found! Please ensure correct spelling and enter complete words (e.g., "Bourne Identity" not "Bourn Identity")';
          } else if (errJson?.Error) {
            apiErr = errJson.Error;
          }
        } catch (_) {}
        throw new Error(apiErr);
      }

      const data = await resp.json();
      if (data && Array.isArray(data.movies)) {
        setResults(data.movies);
      } else {
        setError(
          'Movie not found!\nPlease ensure correct spelling and enter complete words (e.g., "Bourne Identity" not "Bourn Identity")'
        );
      }
    } catch (e) {
      setError(e?.message || "Failed to fetch movies");
    } finally {
      clearTimeout(coldStartTimer);
      setShowColdStartMessage(false);
      setIsLoading(false);
    }
  };

  const handleSelectMovie = (item) => {
    if (activeTileIndex == null) return;
    setSelectedTiles((prev) => {
      const next = [...prev];
      next[activeTileIndex] = item;
      return next;
    });
    setSelectedMovies((prev) => {
      const minimal = {
        Title: item.Title,
        Year: item.Year,
        imdbID: item.imdbID,
        type: (item.Type || "").toLowerCase(),
      };
      const existingIndex = prev.findIndex((m) => m.imdbID === minimal.imdbID);
      if (existingIndex !== -1) {
        const next = [...prev];
        next[existingIndex] = minimal;
        return next;
      }
      return [...prev, minimal];
    });
    setShowSearch(false);
    setQuery("");
    setResults([]);
    setError("");
  };

  const handleRemoveMovie = (index) => {
    const removedMovie = selectedTiles[index];

    setSelectedTiles((prev) => {
      const next = [...prev];
      next[index] = null;
      // Shift remaining movies to fill the gap
      for (let i = index; i < next.length - 1; i++) {
        next[i] = next[i + 1];
      }
      next[next.length - 1] = null;
      return next;
    });

    if (removedMovie) {
      setSelectedMovies((prev) => {
        // Remove the movie from selectedMovies array
        return prev.filter((movie) => movie.imdbID !== removedMovie.imdbID);
      });
    }
  };

  const handleFindNextMovie = async () => {
    if (selectedMovies.length < 2) return;

    setIsRecommendationLoading(true);
    setRecommendationError("");

    // Scroll to the loading animation with a small delay to ensure state updates first
    setTimeout(() => {
      if (loadingAnimationRef.current) {
        loadingAnimationRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);

    try {
      // Build preferences array with ranking based on tile order
      const preferences = selectedTiles
        .map((tile, index) => {
          if (!tile) return null;
          return {
            ranking: (index + 1).toString(),
            Title: tile.Title,
            Year: tile.Year,
            imdbID: tile.imdbID,
            Type: tile.Type || "movie",
          };
        })
        .filter(Boolean); // Remove null entries

      const requestBody = { preferences };

      const backendUrl =
        MOVIE_RECOMMEND_BACKEND + "/" + MOVIE_RECOMMEND_BACKEND_ENDPOINT;

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Recommendation response:", data);

      if (
        data &&
        data.response &&
        Array.isArray(data.response.recommendations)
      ) {
        setRecommendations(data.response.recommendations);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      setRecommendationError(error.message || "Failed to get recommendations");
    } finally {
      setIsRecommendationLoading(false);
    }
  };

  return (
    <section className="homepage-hero">
      <InfoCard />
      {showSearch && (
        <div
          className="searchbar-overlay"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseSearch}
        >
          <div
            className="searchbar-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="searchbar-hint">
              Press Esc or anywhere else on the screen to close the search bar.
            </div>
            <div className="searchbar">
              <input
                type="text"
                placeholder="Search movies - Use complete words"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => warmupBackend()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") performSearch();
                }}
              />
              <button
                aria-label="Submit search"
                onClick={performSearch}
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
            {error && (
              <div
                style={{
                  color: "#ff8a8a",
                  marginTop: "0.5rem",
                  whiteSpace: "pre-line",
                }}
              >
                {error}
              </div>
            )}
            {isLoading && showColdStartMessage && (
              <div
                style={{
                  color: "#ffd280",
                  marginTop: "0.5rem",
                  fontStyle: "italic",
                }}
              >
                Backend is having its morning coffee... (cold start)
              </div>
            )}
            {results.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <div className="poster-grid">
                  {results.map((item) => (
                    <div
                      className="poster-card"
                      key={item.imdbID}
                      onClick={() => handleSelectMovie(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="poster-wrap">
                        {item.Poster && item.Poster !== "N/A" ? (
                          <img
                            src={item.Poster}
                            alt={`Poster of ${item.Title}`}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = posterNotAvailable;
                            }}
                          />
                        ) : (
                          <img
                            src={posterNotAvailable}
                            alt="Poster not available"
                          />
                        )}
                      </div>
                      <div className="poster-meta">
                        <div className="poster-title">{item.Title}</div>
                        <div className="poster-year">Year: {item.Year}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="logo-container">
        <img
          src={moviesLikeTheseLogo}
          alt="Movies Like These"
          className="main-logo"
        />
      </div>
      <div className="tile-grid">
        {[0, 1, 2].map((idx) => {
          const selected = selectedTiles[idx];
          const defaults = [
            { img: reelIcon, alt: "Movie reel" },
            { img: popcornIcon, alt: "Popcorn" },
            { img: clapperIcon, alt: "Clapperboard" },
          ];
          return (
            <button
              key={idx}
              className={`tile-button${selected ? " selected" : ""}`}
              aria-label={`Select tile ${idx + 1}`}
              onClick={() => handleOpenSearch(idx)}
            >
              {selected ? (
                <div className="tile-selected">
                  <button
                    className="tile-remove-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMovie(idx);
                    }}
                    aria-label={`Remove ${selected.Title}`}
                  >
                    ×
                  </button>
                  <div className="tile-poster-wrap">
                    {selected.Poster && selected.Poster !== "N/A" ? (
                      <img
                        src={selected.Poster}
                        alt={`Poster of ${selected.Title}`}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = posterNotAvailable;
                        }}
                      />
                    ) : (
                      <img
                        src={posterNotAvailable}
                        alt="Poster not available"
                      />
                    )}
                  </div>
                  <div className="tile-selected-meta">
                    <div className="tile-selected-title">{selected.Title}</div>
                    <div className="tile-selected-year">
                      Year: {selected.Year}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <img src={defaults[idx].img} alt={defaults[idx].alt} />
                  <span className="tile-plus">+</span>
                </>
              )}
            </button>
          );
        })}
      </div>
      <div className="button-container">
        <button
          className={`btn-primary ${
            selectedMovies.length < 2 ? "disabled" : ""
          }`}
          disabled={selectedMovies.length < 2 || isRecommendationLoading}
          onClick={handleFindNextMovie}
          title={
            selectedMovies.length < 2
              ? "Pick at least 2 movies to find your next similar movie"
              : ""
          }
        >
          {isRecommendationLoading
            ? "Finding recommendations..."
            : "🍿 Pick For Me"}
        </button>
        {selectedMovies.length < 2 && (
          <div className="button-message">
            Select at least 2 movies to find your next similar movie
          </div>
        )}
        {recommendationError && (
          <div className="button-message" style={{ color: "#ff8a8a" }}>
            {recommendationError}
          </div>
        )}
        <div ref={loadingAnimationRef}>
          <LoadingAnimation isVisible={isRecommendationLoading} />
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations-section" ref={recommendationsRef}>
          <h2 className="recommendations-title">Your Movie Recommendations</h2>
          <div className="recommendations-container">
            {recommendations.map((movie, index) => (
              <MovieRecommendation key={index} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default MovieSelector;
