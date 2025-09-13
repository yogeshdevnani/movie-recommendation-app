import React, { useState, useEffect } from 'react'

const LoadingAnimation = ({ isVisible }) => {
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0)
  
  const emojis = [
    { emoji: '🔎', text: 'Searching through thousands of movies...' },
    { emoji: '💻', text: 'Analyzing your preferences...' },
    { emoji: '💡', text: 'Finding perfect matches...' },
    { emoji: '🤔', text: 'Considering options...' },
    { emoji: '🪄', text: 'Almost there...' }
  ]

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setCurrentEmojiIndex((prev) => (prev + 1) % emojis.length)
    }, 1000)

    return () => clearInterval(interval)
  }, [isVisible, emojis.length])

  if (!isVisible) return null

  return (
    <div className="loading-animation-container">
      <div className="loading-animation-card">
        <div className="emoji-sequence">
          {emojis.map((item, index) => (
            <div
              key={index}
              className={`emoji-item ${index === currentEmojiIndex ? 'active' : ''}`}
            >
              {item.emoji}
            </div>
          ))}
        </div>
        <div className="loading-text">
          {emojis[currentEmojiIndex].text}
        </div>
      </div>
    </div>
  )
}

export default LoadingAnimation
