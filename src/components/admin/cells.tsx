'use client'

import type { DefaultCellComponentProps } from 'payload'
import React from 'react'

import './admin.scss'

// pill tones: green live, blue in progress, yellow attention, red closed, grey done
const TONES: Record<string, 'b' | 'c' | 'g' | 'k' | 'm' | 'muted' | 'r' | 'y'> = {
  // roles
  superadmin: 'm',
  client: 'c',
  demo: 'y',
  // visibility
  public: 'g',
  private: 'r',
  // stage
  planning: 'muted',
  active: 'b',
  shipped: 'g',
  maintained: 'c',
  archived: 'k',
}

const LABELS: Record<string, string> = {
  superadmin: 'owner',
  active: 'in progress',
}

export const PillCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  if (cellData === null || cellData === undefined || cellData === '') {
    return <span className="xn-cell-muted">-</span>
  }
  const value = String(cellData)
  return (
    <span className={`xn-pill xn-pill--${TONES[value] ?? 'muted'}`}>{LABELS[value] ?? value}</span>
  )
}

