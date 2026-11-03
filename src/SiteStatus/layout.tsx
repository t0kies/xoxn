'use client'

import React from 'react'

import { EmailSignup } from './email-signup'
import { useCountdown } from './use-countdown'

type StatusLayoutProps = {
  label: string
  title: string
  message?: string
  countdownTo?: string
  showEmailSignup?: boolean
  bypassPaths?: string[]
}

export const StatusLayout: React.FC<StatusLayoutProps> = ({
  label,
  title,
  message,
  countdownTo,
  showEmailSignup,
  bypassPaths,
}) => {
  const countdown = useCountdown(countdownTo)

  return (
    <div className="container flex min-h-[70vh] flex-col justify-center py-[4lh]">
      <div className="max-w-[60ch]">
        <p className="tui-cmd mb-[0.5lh]">{label}</p>
        <h1 className="mb-[1lh] text-4xl font-bold sm:text-5xl">{title}</h1>
        {message && <p className="mb-[1.5lh] text-body">{message}</p>}
        {countdown && (
          <p
            className="tui-window tui-shadow mb-[1.5lh] inline-block px-[2ch] py-[0.75lh] text-2xl tabular-nums"
            data-title="eta"
          >
            {countdown}
          </p>
        )}
        {showEmailSignup && <EmailSignup />}
        {bypassPaths && bypassPaths.length > 0 && (
          <div className="mt-8">
            <p className="tui-cmd mb-[0.5lh]">ls still-open/</p>
            <ul className="flex flex-col gap-1">
              {bypassPaths.map((path) => (
                <li key={path}>
                  <a className="tui-link" href={path}>
                    {path}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
