import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div>
        <Link to="/">QuickMovieRecommendation</Link>
      </div>
      <div>
        <Link to="/about" className="btn-about">About</Link>
      </div>
    </nav>
  )
}

export default Navbar
