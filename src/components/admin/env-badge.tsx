import React from 'react'

import { buildInfo } from '@/utilities/build-info'

import './admin.scss'

// which instance and commit this admin is; production stays quiet
export const EnvBadge: React.FC = () => {
  const { env, isProduction, sha, branch } = buildInfo()
  return (
    <span
      className={`xn-chip xn-env${isProduction ? '' : ' xn-env--dev'}`}
      title={
        [branch && `branch ${branch}`, sha && `commit ${sha}`].filter(Boolean).join(' · ') ||
        undefined
      }
    >
      <span aria-hidden className="xn-env__dot" />
      {env}
      {sha && <span className="xn-env__sha">@{sha}</span>}
    </span>
  )
}

export default EnvBadge
