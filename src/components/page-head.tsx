import React from 'react'

// the command that printed the page, then the title
export const PageHead: React.FC<{
  cmd?: null | string
  title?: React.ReactNode
  children?: React.ReactNode
  className?: string
}> = ({ cmd, title, children, className }) => (
  <header
    className={['container flex flex-col gap-[0.5lh] pt-[2lh] pb-[1.5lh]', className]
      .filter(Boolean)
      .join(' ')}
  >
    {cmd && (
      <p className="flex items-baseline justify-between gap-[2ch]">
        <span className="tui-cmd">{cmd}</span>
      </p>
    )}
    {title && <h1 className="tui-rule text-3xl font-bold sm:text-4xl">{title}</h1>}
    {children}
  </header>
)
