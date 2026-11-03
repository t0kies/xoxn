'use client'
import type { EmailField, TextAreaField, TextField } from '@payloadcms/plugin-form-builder/types'
import React from 'react'

import { Frame, inputClass, type FieldProps } from './frame'

export const Text: React.FC<TextField & FieldProps & { type?: string }> = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required,
  width,
  type = 'text',
}) => (
  <Frame {...{ errors, label, name, required, width }}>
    <input
      autoComplete={name === 'phone' ? 'tel' : undefined}
      className={inputClass}
      defaultValue={defaultValue}
      id={name}
      type={name === 'phone' ? 'tel' : type}
      {...register(name, { required: required || false })}
    />
  </Frame>
)

export const Email: React.FC<EmailField & FieldProps> = ({
  name,
  errors,
  label,
  register,
  required,
  width,
}) => (
  <Frame {...{ errors, label, name, required, width }}>
    <input
      autoComplete="email"
      className={inputClass}
      id={name}
      type="email"
      {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required: required || false })}
    />
  </Frame>
)

export const Textarea: React.FC<TextAreaField & FieldProps> = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required,
  width,
}) => (
  <Frame {...{ errors, label, name, required, width }}>
    <textarea
      className={inputClass}
      defaultValue={defaultValue}
      id={name}
      rows={4}
      {...register(name, { required: required || false })}
    />
  </Frame>
)
