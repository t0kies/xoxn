import type { Metadata } from 'next'

import Link from 'next/link'
import React from 'react'

import { FORM_SUBMISSION_RETENTION_MONTHS } from '@/jobs/purge-form-submissions'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { PageHead } from '@/components/page-head'

export const dynamic = 'force-dynamic'

const LAST_UPDATED = 'October 2, 2026'

export default function Page() {
  return (
    <main className="pt-[var(--header-height)] pb-[3lh]">
      <PageHead cmd="man privacy" title="Privacy">
        <p className="max-w-[60ch] text-body">
          TL;DR: Unless you reach out or provide information through our forms (which we collect for
          the purpose of responding or managing your requests), this site doesn&apos;t track you or
          sell your data.
        </p>
      </PageHead>

      <div className="container">
        <div className="prose">
          <h2>We don&apos;t track you</h2>
          <p>
            No third-party trackers, analytics, or ads service providers are used on this site. Your
            visit is not tracked or sold. We only collect information from forms submitted and
            registered users in order to provide and manage their accounts, and manage this site
            effectively.
          </p>

          <h2>What you send</h2>
          <p>
            If you write through the <Link href="/contact">contact form</Link>, your message and the
            details you enter are used only to reply to you, and deleted after{' '}
            {FORM_SUBMISSION_RETENTION_MONTHS} months.
          </p>
          <p>
            If you join the waitlist while the site isn&apos;t open yet, your email is used only to
            tell you when it opens, then deleted, sooner if you ask.
          </p>

          <h2>Other sites and services</h2>
          <p>
            Links to other sites, and services this site points you to, are run by their owners
            under their own privacy policies.
          </p>

          <h2>Questions or deletion</h2>
          <p>
            To see or delete anything you sent, use the <Link href="/contact">contact form</Link>.
          </p>

          <p className="text-sm text-dim">Last updated {LAST_UPDATED}.</p>
        </div>
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  const title = 'Privacy'
  const description =
    'Unless you reach out or provide information through our forms (which we collect for the purpose of responding or managing your requests), this site doesn&apos;t track you or sell your data.'
  return {
    title,
    description,
    openGraph: mergeOpenGraph({ title, description, url: '/privacy-policy' }),
  }
}
