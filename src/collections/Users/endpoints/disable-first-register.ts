import type { Endpoint } from 'payload'

// shadows Payload's first-register, which skips access when there are no users;
// the owner only comes from SUPERADMIN_EMAIL
export const disableFirstRegister: Endpoint = {
  path: '/first-register',
  method: 'post',
  handler: async () => {
    return Response.json(
      { message: 'Registration is disabled. Accounts are provisioned from the backend only.' },
      { status: 403 },
    )
  },
}
