import React from 'react'

const Spinner = ({ mode = 'dark' }) => {
  return (
    <div className={`${mode === 'light' ? 'dot-spinner__light' : 'dot-spinner__dark'}`}>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
    </div>
  )
}

export default Spinner
