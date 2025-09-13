import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div>
        <Link to="/" className="navbar-title">QuickMovieRecommendation</Link>
      </div>
      <div>
        <Link to="/about" className="btn-about">About</Link>
      </div>
    </nav>
  )
}

export default Navbar
