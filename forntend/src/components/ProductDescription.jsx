import React from 'react'

const ProductDescription = () => {
   
  return (
    <div className='max-padd-container mt-20'>
        <div className='flex gap-3 mb-4'>
            <button className='btn-dark rounded-sm !text-xs !py-[6px] w-36'>Description</button>
            <button  className='btn-dark-outline rounded-sm !text-xs !py-[6px] w-36'>Care Guide</button>
            <button  className='btn-dark-outline rounded-sm !text-xs !py-[6px] w-36'>Size Guide</button>
        </div>
        <div>
            <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium odit facere beatae dolore, at asperiores vel. Vero praesentium voluptate, nesciunt optio omnis quod? Maxime sed numquam quae, vel similique nihil?</p>
            <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium odit facere beatae dolore, at asperiores vel.</p>
        </div>
    </div>
  )
}

export default ProductDescription