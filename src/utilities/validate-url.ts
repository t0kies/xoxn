const SAFE =
  /^(https?:\/\/[^\s"'<>]+|mailto:[^\s"'<>]+|tel:[+\d\s()-]+|\/(?!\/)[^\s"'<>]*|#[\w-]*)$/i

// Blocks javascript:/data: and protocol-relative URLs in editor-supplied links.
export const isSafeUrl = (value: unknown): boolean =>
  typeof value === 'string' && SAFE.test(value.trim())

export const validateUrl = (value: unknown): true | string =>
  !value || isSafeUrl(value) || 'Use https://…, mailto:, tel: or a site path starting with /'

// Same, but only absolute https/http links (external booking, ordering, social profiles).
export const validateExternalUrl = (value: unknown): true | string =>
  !value ||
  (typeof value === 'string' && /^https?:\/\/[^\s"'<>]+$/i.test(value.trim())) ||
  'Use a full link starting with https://'
