import React from 'react'
import { Link } from 'react-router-dom'
import RelatedProducts from './RelatedProducts'

const Hero = () => {
  return (
    <section>
        <div  className='max-padd-container bg-hero bg-cover bg-center bg-no-repeat h-[744px] w-full'>
            <div className='relative top-24 xs:top-32'>
                <h4 className='uppercase medium-18 tracking-wider'>TRENDY TREASURES</h4>
                <h2 className='h1 capitalize max-w-f[40rem]'>Elevate Your Look <span className='text-secondary'>With <br/> Every Click.</span>Shop Today!</h2>
                <p className='my-5 max-w-[33rem]'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia, qui suscipit earum labore optio reprehenderit dolorem reiciendis ut omnis voluptatibus enim officiis nobis nam libero atque doloribus ex aliquid cupiditate.</p>
                {/* buttons */}
                <div className='inline-flex items-center justify-center gap-4 p-2 bg-white rounded-xl'>
                    <div className='text-center regular-14 leading-tight pl-15'>
                        <h5 className='uppercase font-bold'>30% off</h5>
                        <p className='regular-14'>On All Items</p>
                    </div>
                    <Link to={''} className='btn-dark rounded-xl flexCenter !py-5'>Shop Now</Link>
                </div>
                {/* NewCollections */}
                <div className='mt-16'>
                    <RelatedProducts />
                </div>
            </div>
        </div>
    </section>
  )
}

export default Hero