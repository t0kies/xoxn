'use client'
import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import React from 'react'

import RichText from '@/components/RichText'
import { Checkbox, Select } from './choice'
import type { FieldProps } from './frame'
import { Email, Text, Textarea } from './text'

const Message: React.FC<{ message: DefaultTypedEditorState }> = ({ message }) =>
  message ? <RichText data={message} enableGutter={false} /> : null

export const fields = {
  checkbox: Checkbox,
  email: Email,
  message: Message,
  number: (props: TextField & FieldProps) => <Text {...props} type="number" />,
  select: Select,
  text: Text,
  textarea: Textarea,
}
