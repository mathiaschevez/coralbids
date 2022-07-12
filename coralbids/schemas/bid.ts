export default {
  name: 'bid',
  title: 'Bid',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'string',
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    },
    {
      name: 'product',
      title: 'Product',
      description: 'The product this bid is for',
      type: 'reference',
      to: [{ type: 'product' }],
    }
  ]
}