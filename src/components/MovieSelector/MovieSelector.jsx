import React from 'react'
import reelIcon from '../../assets/movieReel.svg'
import popcornIcon from '../../assets/moviePopcorn.svg'
import clapperIcon from '../../assets/movieClapperBoard.svg'
import posterNotAvailable from '../../assets/posterNotAvailable.jpg'

const MovieSelector = () => {
  const [showSearch, setShowSearch] = React.useState(false)
  const [activeTileIndex, setActiveTileIndex] = React.useState(null)
  const [query, setQuery] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [results, setResults] = React.useState([])
  const [selectedTiles, setSelectedTiles] = React.useState([null, null, null])
  const [selectedMovies, setSelectedMovies] = React.useState([])

  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setShowSearch(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleOpenSearch = (index) => {
    setActiveTileIndex(index)
    setShowSearch(true)
  }
  const handleCloseSearch = () => setShowSearch(false)

  const buildSearchParam = (text) => {
    return text.trim().split(/\s+/).join('+')
  }

  const performSearch = async () => {
    const trimmed = query.trim()
    if (!trimmed) return
    setIsLoading(true)
    setError('')
    setResults([])
    try {
      const s = buildSearchParam(trimmed)
      const resp = await fetch(`/api/omdb/?s=${encodeURIComponent(s)}&type=movie`)
      if (!resp.ok) {
        let apiErr = 'Network error'
        try {
          const errJson = await resp.json()
          if (errJson && errJson.Error) apiErr = errJson.Error
        } catch (_) {}
        throw new Error(apiErr)
      }
      const data = await resp.json()
      if (data.Response === 'True' && Array.isArray(data.Search)) {
        setResults(data.Search)
      } else {
        setError('Movie not found!\nMake sure to enter complete words: example "Die Hard" not "Die Har"')
      }
    } catch (e) {
      setError(e?.message || 'Failed to fetch movies')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectMovie = (item) => {
    if (activeTileIndex == null) return
    setSelectedTiles((prev) => {
      const next = [...prev]
      next[activeTileIndex] = item
      return next
    })
    setSelectedMovies((prev) => {
      const minimal = {
        Title: item.Title,
        Year: item.Year,
        imdbID: item.imdbID,
        type: (item.Type || '').toLowerCase()
      }
      const existingIndex = prev.findIndex((m) => m.imdbID === minimal.imdbID)
      if (existingIndex !== -1) {
        const next = [...prev]
        next[existingIndex] = minimal
        return next
      }
      return [...prev, minimal]
    })
    setShowSearch(false)
    setQuery('')
    setResults([])
    setError('')
  }


  return (
    <section className="homepage-hero">
      {showSearch && (
        <div className="searchbar-overlay" role="dialog" aria-modal="true" onClick={handleCloseSearch}>
          <div className="searchbar-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="searchbar-hint">Press Esc or anywhere else on the screen to close the search bar.</div>
            <div className="searchbar">
              <input type="text" placeholder="Search movies, genres, actors..." autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') performSearch() }} />
              <button aria-label="Submit search" onClick={performSearch} disabled={isLoading}>{isLoading ? 'Searching...' : 'Search'}</button>
            </div>
            {error && <div style={{ color: '#ff8a8a', marginTop: '0.5rem', whiteSpace: 'pre-line' }}>{error}</div>}
            {results.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div className="poster-grid">
                  {results.map((item) => (
                    <div className="poster-card" key={item.imdbID} onClick={() => handleSelectMovie(item)} style={{ cursor: 'pointer' }}>
                      <div className="poster-wrap">
                        {item.Poster && item.Poster !== 'N/A' ? (
                          <img src={item.Poster} alt={`Poster of ${item.Title}`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = posterNotAvailable }} />
                        ) : (
                          <img src={posterNotAvailable} alt="Poster not available" />
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
      <h1>What to watch next?</h1>
      <div className="tile-grid">
        {[0, 1, 2].map((idx) => {
          const selected = selectedTiles[idx]
          const defaults = [
            { img: reelIcon, alt: 'Movie reel' },
            { img: popcornIcon, alt: 'Popcorn' },
            { img: clapperIcon, alt: 'Clapperboard' }
          ]
          return (
            <button key={idx} className={`tile-button${selected ? ' selected' : ''}`} aria-label={`Select tile ${idx + 1}`} onClick={() => handleOpenSearch(idx)}>
              {selected ? (
                <div className="tile-selected">
                  <div className="tile-poster-wrap">
                    {selected.Poster && selected.Poster !== 'N/A' ? (
                      <img src={selected.Poster} alt={`Poster of ${selected.Title}`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = posterNotAvailable }} />
                    ) : (
                      <img src={posterNotAvailable} alt="Poster not available" />
                    )}
                  </div>
                  <div className="tile-selected-meta">
                    <div className="tile-selected-title">{selected.Title}</div>
                    <div className="tile-selected-year">Year: {selected.Year}</div>
                  </div>
                </div>
              ) : (
                <>
                  <img src={defaults[idx].img} alt={defaults[idx].alt} />
                  <span className="tile-plus">+</span>
                </>
              )}
            </button>
          )
        })}
      </div>
      <div className="button-container">
        <button 
          className={`btn-primary ${selectedMovies.length < 2 ? 'disabled' : ''}`}
          disabled={selectedMovies.length < 2}
          title={selectedMovies.length < 2 ? 'Pick at least 2 movies to find your next similar movie' : ''}
        >
          Find me next movie 🔍
        </button>
        {selectedMovies.length < 2 && (
          <div className="button-message">
            Select at least 2 movies to find your next similar movie
          </div>
        )}
      </div>
    </section>
  )
}

export default MovieSelector
