import React from 'react'

const baseInput = 'px-3 py-1.5 text-stone-300 md:text-base text-sm border border-stone-900 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed'

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
