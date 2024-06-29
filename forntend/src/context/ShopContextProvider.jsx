import React from 'react'
import { useEffect } from 'react';
import { createContext } from 'react'

import { useState } from 'react';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {}
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
}



const ShopContextProvider = (props) => {

  const [all_products, setall_Products] = useState([])
  const [cartItems, setCartItems] = useState(getDefaultCart())

  useEffect(()=>{
    fetch('http://localhost:1023/allproducts').then((response) => response.json()).then((data)=>setall_Products(data));
    if(localStorage.getItem('auth-token')){
      fetch('http://localhost:1023/getcart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',
        },
        body:"",
      }).then((response)=> response.json()).then((data)=> setCartItems(data));
    }
  },[])

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
    // console.log(cartItems)
    if (localStorage.getItem('auth-token')){
      fetch('http://localhost:1023/addtocart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',
        },
        body:JSON.stringify({'itemID':itemId}),
      }).then((response)=>response.json()).then((data)=>console.log(data))
    }
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    
    if (localStorage.getItem('auth-token')){
      fetch('http://localhost:1023/removeFromCart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',
        },
        body:JSON.stringify({'itemID':itemId}),
      }).then((response)=>response.json()).then((data)=>console.log(data))
    }
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_products.find((product) =>
          
          product.id === Number(item));
          console.log("iteminfot"+itemInfo)
        totalAmount += itemInfo.new_price * cartItems[item]
      }
    }
    return totalAmount;
  }

  const getTotalCartItems = ()=> {
    let totalItem = 0;
    for(const item in cartItems){
      if(cartItems[item]>0){
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  }

  const contextValue = { all_products, cartItems, addToCart, removeFromCart,getTotalCartAmount,getTotalCartItems };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>

  )
}

export default ShopContextProvider