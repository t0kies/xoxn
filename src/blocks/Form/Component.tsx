'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import Link from 'next/link'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import RichText from '@/components/RichText'
import { fields } from './fields'
import { Honeypot } from '@/components/honeypot'
import { useSubmit } from './submit'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
}

export const FormBlock: React.FC<{ id?: string } & FormBlockType> = ({
  enableIntro,
  form,
  introContent,
}) => {
  const { id: formID, confirmationMessage, confirmationType, submitButtonLabel } = form
  const formMethods = useForm({ defaultValues: form.fields })
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods
  const [gotcha, setGotcha] = useState('')
  const { error, hasSubmitted, isLoading, onSubmit } = useSubmit(form, gotcha)

  return (
    <div className="container [&>*]:max-w-[72ch]">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-[1.5lh]" data={introContent} enableGutter={false} />
      )}
      <div className="tui-window tui-shadow px-[2ch] py-[1.5lh]" data-title={form?.title || 'form'}>
        <FormProvider {...formMethods}>
          {!isLoading && hasSubmitted && confirmationType === 'message' && (
            <RichText data={confirmationMessage} />
          )}
          {isLoading && !hasSubmitted && (
            <p className="mb-[1lh] flex items-center gap-[1ch]">
              <span is-="spinner" variant-="dots" /> sending...
            </p>
          )}
          {error && (
            <p
              className="mb-[1lh] text-red"
              role="alert"
            >{`! ${error.status || '500'}: ${error.message || ''}`}</p>
          )}
          {!hasSubmitted && (
            <form id={formID} onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-[1lh]">
                {form.fields?.map((field, index) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                  if (!Field) return null
                  return (
                    <Field form={form} key={index} {...field} errors={errors} register={register} />
                  )
                })}
              </div>
              <Honeypot onChange={setGotcha} value={gotcha} />
              <p className="my-[1lh] text-xs text-dim">
                By submitting this form, you agree to our{' '}
                <Link className="underline underline-offset-4" href="/privacy-policy">
                  Privacy Policy
                </Link>
                .
              </p>
              <button form={formID} is-="button" type="submit" variant-="accent">
                {submitButtonLabel}
              </button>
            </form>
          )}
        </FormProvider>
      </div>
    </div>
  )
}
