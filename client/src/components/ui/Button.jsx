import React from 'react'
import { Spinner } from './index'

const baseButton = 'flex items-center justify-center gap-2 px-5 py-2 rounded-full cursor-pointer transition duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed'
const primaryButton = 'bg-gradient-to-r from-violet-300 via-violet-500 to-indigo-500 bg-[length:150%_150%] animate-gradientMove hover:bg-indigo-400/70 disabled:hover:bg-indigo-400 text-black font-semibold'
const secondaryButton = 'bg-indigo-50 text-black'

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
