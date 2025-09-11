import React from 'react'
import reelIcon from '../../assets/movieReel.svg'
import popcornIcon from '../../assets/moviePopcorn.svg'
import clapperIcon from '../../assets/movieClapperBoard.svg'

const MovieSelector = () => {
  return (
    <section className="homepage-hero">
      <h1>What to watch next?</h1>
      <div className="tile-grid">
        <button className="tile-button" aria-label="Select reel">
          <img src={reelIcon} alt="Movie reel" />
          <span className="tile-plus">+</span>
        </button>
        <button className="tile-button" aria-label="Select popcorn">
          <img src={popcornIcon} alt="Popcorn" />
          <span className="tile-plus">+</span>
        </button>
        <button className="tile-button" aria-label="Select clapper">
          <img src={clapperIcon} alt="Clapperboard" />
          <span className="tile-plus">+</span>
        </button>
      </div>
      <button className="btn-primary">Next movie 🔍</button>
    </section>
  )
}

export default MovieSelector
