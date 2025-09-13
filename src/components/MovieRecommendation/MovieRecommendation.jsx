import React from 'react'
import posterNotAvailable from '../../assets/posterNotAvailable.jpg'

const MovieRecommendation = ({ movie }) => {
  // Helper function to get rating by source
  const getRatingBySource = (ratings, source) => {
    const rating = ratings.find(r => 
      r.Source.toLowerCase().includes(source.toLowerCase()) || 
      r.Source.toLowerCase() === source.toLowerCase()
    )
    return rating ? rating.Value : 'N/A'
  }

  const imdbRating = getRatingBySource(movie.Ratings, 'imdb')
  const rottenTomatoesRating = getRatingBySource(movie.Ratings, 'rotten')

  return (
    <div className="movie-recommendation">
      <div className="movie-poster">
        {movie.Poster && movie.Poster !== 'N/A' ? (
          <img 
            src={movie.Poster} 
            alt={`Poster of ${movie.Title}`} 
            onError={(e) => { 
              e.currentTarget.onerror = null
              e.currentTarget.src = posterNotAvailable 
            }} 
          />
        ) : (
          <img src={posterNotAvailable} alt="Poster not available" />
        )}
      </div>
      <div className="movie-details">
        <h3 className="movie-title">{movie.Title}</h3>
        <p className="movie-year">Release Year: {movie.Year}</p>
        <p className="movie-preference">Preference: {movie.ranking}</p>
        <p className="movie-certainty">Will you love it?: {movie.CertaintyLevel}</p>
        <p className="movie-reason">Why to watch this?: {movie.ReasonToBeLoved}</p>
        <p className="movie-plot">Plot: {movie.Plot}</p>
        <p className="movie-imdb">IMDB Rating: {imdbRating}</p>
        <p className="movie-rotten">Rotten Tomatoes: {rottenTomatoesRating}</p>
      </div>
    </div>
  )
}

export default MovieRecommendation
