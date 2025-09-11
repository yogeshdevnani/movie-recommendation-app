import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import MovieSelector from '../components/MovieSelector/MovieSelector'

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main>
        <MovieSelector />
      </main>
    </>
  )
}

export default HomePage
