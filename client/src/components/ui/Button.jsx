import React from 'react'
import { Spinner } from './index'

const baseButton = 'flex items-center justify-center gap-2 px-5 py-2 rounded-full cursor-pointer transition duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed'
const primaryButton = 'bg-lime-400 hover:bg-lime-400/70 disabled:hover:bg-lime-400 text-neutral-900'
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
      className={`${baseButton} ${className} ${variant === 'primary' ? primaryButton : variant === 'secondary' ? secondaryButton : null}`}
    >
      {disabled && <Spinner />}
      {children}
    </button>
  )
}

export default Button
