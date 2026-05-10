import { defineType, defineField } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      description: 'Short, specific — e.g. Gold Layered Name Necklace',
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
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: '2-3 sentences. Focus on the occasion and the feeling, not just the product.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'emotionalHeadline',
      title: 'Emotional Headline',
      type: 'string',
      description: 'One line that speaks to feeling — e.g. Wear your love story',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (₦)',
      type: 'number',
      description: 'Whole number in Naira — e.g. 25000. System formats as ₦25,000 automatically.',
      validation: (Rule) => Rule.required().min(0).error('Price must be a positive number'),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { accept: '.jpg,.jpeg,.png,.webp' },
        },
      ],
      description: 'First image is the primary. Min 1, max 6.',
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
    defineField({
      name: 'isCustomisable',
      title: 'Customisable?',
      type: 'boolean',
      initialValue: false,
      description: 'Can the buyer personalise this product?',
    }),
    defineField({
      name: 'customisationNote',
      title: 'Customisation Note',
      type: 'string',
      description: 'e.g. Send your photo via WhatsApp after ordering. Only fill if customisable.',
      hidden: ({ document }) => !document?.isCustomisable,
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      options: {
        list: [
          { title: 'In Stock', value: 'in_stock' },
          { title: 'Made to Order', value: 'made_to_order' },
          { title: 'Unavailable', value: 'unavailable' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'occasionTags',
      title: 'Occasion Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Anniversary', value: 'Anniversary' },
          { title: 'Birthday', value: 'Birthday' },
          { title: 'Wedding', value: 'Wedding' },
          { title: 'Graduation', value: 'Graduation' },
          { title: 'Proposal', value: 'Proposal' },
          { title: 'Corporate', value: 'Corporate' },
          { title: 'General Gift', value: 'General Gift' },
        ],
      },
    }),
    defineField({
      name: 'whatsappInquiryText',
      title: 'WhatsApp Inquiry Text',
      type: 'text',
      description: 'Custom pre-filled WhatsApp message for this product. Leave blank to use the default template.',
      rows: 3,
    }),
    defineField({
      name: 'isVisible',
      title: 'Visible on Site?',
      type: 'boolean',
      initialValue: true,
      description: 'Hide a product without deleting it.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'availability',
      media: 'images.0',
    },
  },
});
