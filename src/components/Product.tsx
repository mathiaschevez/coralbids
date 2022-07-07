import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { urlFor } from '../db/client'
import { ProductType } from '../utils/types'

const Product = ({ product }: { product: ProductType }) => {
  console.log(product)
  const src = urlFor(product.image && product?.image[0]).url()

  return (
    <Link href={`/coral/${product.slug.current}`}>
      <div className='cursor-pointer'>
        <Image 
          loader={() => src}
          src={src} 
          alt={product.name} 
          height={200}
          width={200}
          className='rounded'
        />
        <h1>{product.name}</h1>
      </div>
    </Link>
  )
}

export default Product