'use client'
import type { Form as FormType, FormFieldBlock } from '@payloadcms/plugin-form-builder/types'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { getClientSideURL } from '@/utilities/getURL'

export type SubmitError = { message: string; status?: string }

// Posts the answers plus the honeypot; the spinner shows only after 1 s.
export const useSubmit = (form: Partial<FormType>, gotcha: string) => {
  const { id: formID, confirmationType, redirect } = form
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<SubmitError | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      const submitForm = async () => {
        setError(undefined)
        const submissionData = [
          ...Object.entries(data).map(([name, value]) => ({ field: name, value })),
          { field: '_gotcha', value: gotcha },
        ]
        const loadingTimer = setTimeout(() => setIsLoading(true), 1000)
        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({ form: formID, submissionData }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })
          const res = await req.json()
          clearTimeout(loadingTimer)
          setIsLoading(false)
          if (req.status >= 400) {
            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })
            return
          }
          setHasSubmitted(true)
          if (confirmationType === 'redirect' && redirect?.url) router.push(redirect.url)
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({ message: "Couldn't send the form. Check your connection and try again." })
        }
      }
      void submitForm()
    },
    [router, formID, redirect, confirmationType, gotcha],
  )

  return { error, hasSubmitted, isLoading, onSubmit }
}
