import React from 'react'

// Invisible to people; bots that fill every field trip it. Checked on the server.
export const Honeypot: React.FC<{
  name?: string
  value: string
  onChange: (value: string) => void
}> = ({ name, value, onChange }) => (
  <input
    aria-hidden="true"
    autoComplete="off"
    className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
    name={name}
    onChange={(e) => onChange(e.target.value)}
    tabIndex={-1}
    type="text"
    value={value}
  />
)
