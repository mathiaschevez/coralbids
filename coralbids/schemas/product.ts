export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{ type: 'image' }],
      options: {
        hotspot: true,
      }
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'key',
      title: 'Key',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 90,
      }
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'details',
      title: 'Details',
      type: 'string',
    },
    {
      title: 'Opening Date',
      name: 'openingDate',
      type: 'datetime'
    },
    {
      name: 'winningBid',
      title: 'Winning Bid',
      type: 'object',
      fields: [
        {name: 'id', type: 'string', title: 'ID'},
        {name: 'name', type: 'string', title: 'Name'},
        {name: 'email', type: 'string', title: 'Email'},
        {name: 'image', type: 'string', title: 'Image'},
        {name: 'dateTime', type: 'datetime', title: 'Date Time'}
      ]
    },
    {
      name: 'bidCompleted',
      title: 'Bid Completed',
      type: 'boolean',
    }
  ] 
}