'use client'
import Link from 'next/link'
import React, { useState } from 'react'

import { Honeypot } from '@/components/honeypot'
import { getClientSideURL } from '@/utilities/getURL'

// the waitlist: one email field, a honeypot and the privacy note
export const EmailSignup: React.FC = () => {
  const [email, setEmail] = useState('')
  const [gotcha, setGotcha] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')

    try {
      const req = await fetch(`${getClientSideURL()}/api/waitlist`, {
        body: JSON.stringify({ _gotcha: gotcha, email }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      setState(req.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return <p className="text-sm text-body">[ok] you&apos;re on the list</p>
  }

  return (
    <div className="max-w-[24rem]">
      <form className="flex items-center gap-[1ch]" onSubmit={onSubmit}>
        <input
          className="h-[2lh] min-w-0 flex-1"
          disabled={state === 'loading'}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
        <button disabled={state === 'loading'} is-="button" type="submit" variant-="accent">
          Notify me
        </button>
        <Honeypot name="_gotcha" onChange={setGotcha} value={gotcha} />
      </form>
      {state === 'error' && <p className="mt-[0.5lh] text-sm text-red">! something went wrong</p>}
      <p className="mt-[0.5lh] text-xs text-dim">
        By submitting, you agree to our{' '}
        <Link className="underline underline-offset-4" href="/privacy-policy">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}
