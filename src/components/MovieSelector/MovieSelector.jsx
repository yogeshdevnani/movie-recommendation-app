import React from 'react'
import reelIcon from '../../assets/movieReel.svg'
import popcornIcon from '../../assets/moviePopcorn.svg'
import clapperIcon from '../../assets/movieClapperBoard.svg'

const MovieSelector = () => {
  const [showSearch, setShowSearch] = React.useState(false)

  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setShowSearch(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleOpenSearch = () => setShowSearch(true)
  const handleCloseSearch = () => setShowSearch(false)

  return (
    <section className="homepage-hero">
      {showSearch && (
        <div className="searchbar-overlay" role="dialog" aria-modal="true">
          <div className="searchbar-dialog">
            <div className="searchbar">
              <input type="text" placeholder="Search movies, genres, actors..." autoFocus />
              <button onClick={handleCloseSearch} aria-label="Close search">Close</button>
            </div>
          </div>
        </div>
      )}
      <h1>What to watch next?</h1>
      <div className="tile-grid">
        <button className="tile-button" aria-label="Select reel" onClick={handleOpenSearch}>
          <img src={reelIcon} alt="Movie reel" />
          <span className="tile-plus">+</span>
        </button>
        <button className="tile-button" aria-label="Select popcorn" onClick={handleOpenSearch}>
          <img src={popcornIcon} alt="Popcorn" />
          <span className="tile-plus">+</span>
        </button>
        <button className="tile-button" aria-label="Select clapper" onClick={handleOpenSearch}>
          <img src={clapperIcon} alt="Clapperboard" />
          <span className="tile-plus">+</span>
        </button>
      </div>
      <button className="btn-primary">Next movie 🔍</button>
    </section>
  )
}

export default MovieSelector
