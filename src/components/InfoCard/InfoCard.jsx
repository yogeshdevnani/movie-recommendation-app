import React, { useState } from 'react'

const InfoCard = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [isDismissing, setIsDismissing] = useState(false)

  const handleDismiss = () => {
    setIsDismissing(true)
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false)
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div className={`info-card ${isDismissing ? 'dismissing' : ''}`}>
      <div className="info-card-content">
        <div className="info-card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
          </svg>
        </div>
        <div className="info-card-text">
          <h3 className="info-card-title">How it works</h3>
          <p className="info-card-message">
            Tell us 2-3 movies you love, and we'll find your next watch! We will recommend you two movies that we hope you will love.
          </p>
        </div>
        <button 
          className="info-card-close"
          onClick={handleDismiss}
          aria-label="Dismiss info card"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default InfoCard
