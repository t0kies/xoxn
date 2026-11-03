import canUseDOM from './canUseDOM'

const withProtocol = (value: string): string => {
  const trimmed = value.trim().replace(/^['\"]|['\"]$/g, '')
  if (!trimmed) return ''

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export const getServerSideURL = () => {
  const configured = withProtocol(process.env.NEXT_PUBLIC_SERVER_URL || '')
  if (configured) return configured

  return process.env.RAILWAY_PUBLIC_DOMAIN
    ? withProtocol(process.env.RAILWAY_PUBLIC_DOMAIN)
    : 'http://localhost:3000'
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return withProtocol(process.env.RAILWAY_PUBLIC_DOMAIN)
  }

  return withProtocol(process.env.NEXT_PUBLIC_SERVER_URL || '')
}
