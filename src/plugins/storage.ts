import { s3Storage } from '@payloadcms/storage-s3'

// Uploads go to the bucket when BUCKET is set (Railway), else to disk.
export const storage = s3Storage({
  enabled: Boolean(process.env.BUCKET),
  collections: { media: true, 'showcase-files': true },
  bucket: process.env.BUCKET || 'disabled-bucket',
  config: {
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID || 'disabled-access-key-id',
      secretAccessKey: process.env.SECRET_ACCESS_KEY || 'disabled-secret-access-key',
    },
    region: process.env.REGION || 'auto',
    endpoint: process.env.ENDPOINT || 'https://storage.railway.app',
  },
})
