import Link from 'next/link'
import React from 'react'

type ErrorLayoutProps = {
  code: string
  title: string
  message: string
  cta?: { label: string } & (
    { href: string; onClick?: never } | { href?: never; onClick: () => void }
  )
}

// A failed command: the exit status in red, the title, and a way back.
export const ErrorLayout: React.FC<ErrorLayoutProps> = ({ code, title, message, cta }) => (
  <main className="container flex min-h-[70vh] flex-col justify-center py-[4lh]">
    <div className="max-w-[60ch]">
      <p className="mb-[0.5lh] flex flex-wrap items-baseline gap-x-[2ch] text-sm text-red">
        <span>
          [error {code}] process exited with status {code}
        </span>
      </p>
      <h1 className="mb-[1lh] text-4xl font-bold sm:text-5xl">{title}</h1>
      <p className="mb-[1.5lh] text-body">
        <span className="text-link">$ </span>
        {message}
      </p>
      {cta &&
        (cta.onClick ? (
          <button is-="button" onClick={cta.onClick} type="button" variant-="accent">
            {cta.label}
          </button>
        ) : (
          <Link href={cta.href} is-="button" variant-="accent">
            {cta.label}
          </Link>
        ))}
    </div>
  </main>
)
