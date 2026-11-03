import type { RequiredDataFromCollectionSlug } from 'payload'

import { doc, h, p } from './rich-text'

export const contactForm: RequiredDataFromCollectionSlug<'forms'> = {
  title: 'Contact Form',
  submitButtonLabel: 'Send Message',
  confirmationType: 'message',
  confirmationMessage: doc(
    h('h2', 'Thanks, message received.'),
    p('Lorem ipsum: you will hear back soon.'),
  ),
  emails: [
    {
      emailFrom: '"xoxn" <hello@xoxn.example>',
      emailTo: '{{email}}',
      subject: "You've received a new message from the xoxn contact form.",
      message: doc(
        p('Your message to xoxn was received. Juniper will reply as soon as they can.'),
      ),
    },
  ],
  fields: [
    { name: 'full-name', blockType: 'text', label: 'Full Name', required: true, width: 100 },
    { name: 'email', blockType: 'email', label: 'Email', required: true, width: 100 },
    { name: 'phone', blockType: 'text', label: 'Phone', required: false, width: 100 },
    { name: 'message', blockType: 'textarea', label: 'Message', required: true, width: 100 },
  ],
}
