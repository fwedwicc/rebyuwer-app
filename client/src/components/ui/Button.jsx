import React from 'react'

const baseButton = 'px-5 py-2 rounded-full cursor-pointer transition duration-300 ease-in-out'
const primaryButton = 'bg-lime-300 text-black'
const secondaryButton = 'bg-lime-50 text-black'

const Button = ({
  type = 'button',
  onClick,
  disabled = false,
  children,
  variant,
  className
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseButton} ${className} ${variant === 'secondary' ? secondaryButton : primaryButton}`}
    >
      {children}
    </button>
  )
}

export default Button
