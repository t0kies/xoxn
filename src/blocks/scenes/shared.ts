// Uploads are validated in the admin but nullable in the database: a NOT NULL
// column would break when the file is deleted or the seed clears Media.
export const requiredUpload = (value: unknown) => (value ? true : 'Required')

export const caption = { name: 'caption', type: 'text' as const }
