import React from 'react'
import Navbar from '../components/Navbar/Navbar'

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <main>
        <h1>About</h1>
        <p style={{ color: 'var(--muted)' }}>
          This project helps you decide what to watch next using simple preferences
          and API-powered recommendations.
        </p>
      </main>
    </>
  )
}

export default AboutPage
