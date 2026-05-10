import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'Main headline on the homepage hero section',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'string',
      description: 'Subheadline below the main hero headline',
    }),
    defineField({
      name: 'heroCTAPrimary',
      title: 'Primary CTA Label',
      type: 'string',
      initialValue: 'Explore the Collection',
      description: 'Button text for the primary CTA (links to /products)',
    }),
    defineField({
      name: 'heroCTASecondary',
      title: 'Secondary CTA Label',
      type: 'string',
      initialValue: 'Chat on WhatsApp',
      description: 'Button text for the secondary CTA (opens WhatsApp)',
    }),
    defineField({
      name: 'aboutText',
      title: 'About Text',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Brand story content for the About page — uses rich text editor',
    }),
    defineField({
      name: 'aboutImage',
      title: 'About Image',
      type: 'image',
      options: { accept: '.jpg,.jpeg,.png,.webp' },
      description: 'Brand image for the About page',
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Nigerian format: +234XXXXXXXXXX',
      validation: (Rule) =>
        Rule.required().regex(/^\+234\d{10}$/, {
          name: 'Nigerian phone',
        }).error('Please enter a valid Nigerian WhatsApp number starting with +234'),
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      description: 'Without the @ — e.g. photoframesbyvf',
    }),
  ],
});
