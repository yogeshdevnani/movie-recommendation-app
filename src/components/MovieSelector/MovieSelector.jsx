import React from 'react'

const MovieSelector = () => {
  return (
    <section>
      <p style={{ color: 'var(--muted)' }}>
        Select your favorite genres and we will suggest what to watch next.
      </p>
      {/* Placeholder: add inputs/controls later */}
      <div style={{ marginTop: '1rem' }}>
        <button style={{ padding: '0.6rem 1rem' }}>Get Recommendations</button>
      </div>
    </section>
  )
}

export default MovieSelector
