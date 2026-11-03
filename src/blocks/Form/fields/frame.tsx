import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'
import React from 'react'

export type FieldProps = {
  errors: Partial<FieldErrorsImpl>
  register: UseFormRegister<FieldValues>
}

export const inputClass = 'w-full bg-surface px-[1ch]'

// label above, `! message` below, width as a percentage of the form
export const Frame: React.FC<{
  children: React.ReactNode
  errors: Partial<FieldErrorsImpl>
  label?: null | string
  name: string
  required?: boolean | null
  width?: null | number
  inline?: boolean
}> = ({ children, errors, label, name, required, width, inline }) => (
  <div style={{ maxWidth: width ? `${width}%` : undefined }}>
    {inline ? (
      <label className="flex cursor-pointer items-center gap-[1ch]" htmlFor={name}>
        {children}
        {label}
        {required && <span className="text-red">*</span>}
      </label>
    ) : (
      <>
        <label className="mb-[0.25lh] block text-sm text-dim" htmlFor={name}>
          {label}
          {required && <span className="text-red"> *</span>}
        </label>
        {children}
      </>
    )}
    {errors[name] && (
      <p className="mt-[0.25lh] text-sm text-red" role="alert">
        ! {(errors[name]?.message as string) || 'this field is required'}
      </p>
    )}
  </div>
)
