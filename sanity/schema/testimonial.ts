import { defineType, defineField } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      description: 'First name or initials only — privacy protection',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Nigerian city, e.g. Lagos, Abuja, Port Harcourt',
    }),
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      description: 'e.g. Acrylic Frame, Gold Necklace',
    }),
    defineField({
      name: 'reviewText',
      title: 'Review',
      type: 'text',
      description: 'Customer\'s own words — displayed verbatim',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
      options: {
        list: [
          { title: '1 Star', value: 1 },
          { title: '2 Stars', value: 2 },
          { title: '3 Stars', value: 3 },
          { title: '4 Stars', value: 4 },
          { title: '5 Stars', value: 5 },
        ],
      },
    }),
    defineField({
      name: 'isVisible',
      title: 'Visible on Site?',
      type: 'boolean',
      initialValue: false,
      description: 'Admin must approve before testimonial appears on the site.',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'Date of the review. Displayed as DD/MM/YYYY.',
      options: { dateFormat: 'DD/MM/YYYY' },
    }),
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'reviewText',
    },
  },
  orderings: [
    {
      title: 'Date',
      name: 'date',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
});
