import { defineType, defineField } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      description: 'Display name, e.g. Acrylic Frames',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short category tagline (1-2 sentences)',
      rows: 2,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { accept: '.jpg,.jpeg,.png,.webp' },
      description: 'Primary image shown on category card. Minimum 800px wide.',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
      description: 'Lower numbers appear first. 1 = first.',
    }),
    defineField({
      name: 'isActive',
      title: 'Active?',
      type: 'boolean',
      initialValue: true,
      description: 'Show/hide a category without deleting it.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'displayOrder',
      media: 'coverImage',
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
});
