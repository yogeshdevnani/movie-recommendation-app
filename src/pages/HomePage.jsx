import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import MovieSelector from '../components/MovieSelector/MovieSelector'

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main>
        <h1>What Next?</h1>
        <MovieSelector />
      </main>
    </>
  )
}

export default HomePage
