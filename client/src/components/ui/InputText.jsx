import React from 'react'

const baseInput = 'px-3 py-1.5 bg-neutral-50/50 text-neutral-700 border border-neutral-300/50 rounded-full focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-lime-400 transition duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed'

const InputText = ({
  type = 'text',
  disabled = false,
  placeholder = '',
  value = '',
  onChange = {},
  className,
}) => {
  return (
    <input
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${className} ${baseInput}`}
    />
  )
}

export default InputText
