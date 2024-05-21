"use client";
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

const OrderPage = () => {
  const [products, setProducts] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update the date every second

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);


  const addProductToCart = async (product) => {
 // to be continued
  };
  
  // this part we fetch the products from the firestore database
  // adapted from Simon Chan's code from semester 3 web application course
  useEffect(() => {
    const fetchProducts = async () => {
      const db = getFirestore();
      const colRef = collection(db, 'products');

      try {
        const snapshot = await getDocs(colRef);
        const productsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="order-page">
      <header>
        <h1>Connexion Cafe</h1>
        <p>{currentDate.toLocaleString()}</p>
      </header>
      <div className="coffee-items">
        {products.map((product) => (
          <div
            key={product.id}
            className="coffee-item"
            onClick={() => addProductToCart(product)}
          >
            <img src={product.image} alt={product.item_name} />
            <p>{product.name}</p>
            <p>${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;