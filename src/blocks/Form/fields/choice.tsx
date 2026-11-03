'use client'
import type { CheckboxField, SelectField } from '@payloadcms/plugin-form-builder/types'
import React from 'react'

import { Frame, inputClass, type FieldProps } from './frame'

export const Select: React.FC<SelectField & FieldProps> = ({
  name,
  defaultValue,
  errors,
  label,
  options,
  register,
  required,
  width,
}) => (
  <Frame {...{ errors, label, name, required, width }}>
    <select
      className={`${inputClass} h-[1lh]`}
      defaultValue={defaultValue || ''}
      id={name}
      {...register(name, { required: required || false })}
    >
      <option disabled value="">
        -- choose --
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </Frame>
)

export const Checkbox: React.FC<CheckboxField & FieldProps> = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required,
  width,
}) => (
  <Frame {...{ errors, label, name, required, width }} inline>
    <input
      defaultChecked={defaultValue || false}
      id={name}
      is-="checkbox"
      type="checkbox"
      {...register(name, { required: required || false })}
    />
  </Frame>
)
