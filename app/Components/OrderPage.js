"use client";
import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

const OrderPage = () => {
  const [products, setProducts] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // it's used for updating the current date every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update the date every second

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const addProductToCart = async (product) => {
    // check if the adding product exists
    let findProductInCart = await cart.find((i) => {
      return i.id === product.id;
    });

    console.log("Product added to cart:", product);
    // if the product exists in the cart, update the quantity and total amount
    if (findProductInCart) {
      let newCart = [];
      let newItem;

      // update the quantity and total amount of the product
      cart.forEach((item) => {
        if (item.id === product.id) {
          newItem = {
            ...item,
            quantity: item.quantity + 1,
            totalAmount: item.totalAmount + product.price,
          };
          newCart.push(newItem);
        } else {
          newCart.push(item);
        }
      });
      setCart(newCart);
    } else {
      // if the product doesn't exist in the cart, add the product to the cart
      let addingProduct = {
        ...product,
        quantity: 1,
        totalAmount: product.price,
      };
      // update the cart and total amount
      setCart([...cart, addingProduct]);
    }
    updateTotalAmount();
  };
  // this function is used for updating the quantity of the product in the cart
  // this function is from AI Claude 3.0 Opus - I sent the code to AI and asked "please modify, for the order summary section so the price updates at the product was added to the cart"
  const updateTotalAmount = () => {
    let newTotalAmount = 0;
    cart.forEach((item) => {
      newTotalAmount += item.totalAmount;
    });
    setTotalAmount(newTotalAmount);
  };
  // this part we fetch the products from the firestore database
  // adapted from Simon Chan's code from semester 3 web application course, with assistance from github Copilot
  useEffect(() => {
    const fetchProducts = async () => {
      const db = getFirestore();
      const colRef = collection(db, "products");

      try {
        const snapshot = await getDocs(colRef);
        const productsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Increase or decrease product quantity
  const updateProductQuantity = (product, action) => {
    const newCart = [...cart];
    const productIndex = newCart.findIndex((item) => item.id === product.id);

    if (productIndex !== -1) {
      if (action === "increase") {
        newCart[productIndex].quantity += 1;
        newCart[productIndex].totalAmount += product.price;
      } else if (action === "decrease") {
        if (newCart[productIndex].quantity > 1) {
          newCart[productIndex].quantity -= 1;
          newCart[productIndex].totalAmount -= product.price;
        } else {
          newCart.splice(productIndex, 1);
        }
      }
    }

    setCart(newCart);
  };

  return (
    <div className="order-page">
      <header className="page-header">
        <h1 className="page-heading-1">Connexion Cafe</h1>
        <p>{currentDate.toLocaleString()}</p>
      </header>

      <div className="order-content">
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
        <div className="order-summary">
          <h2>{"Order Summary"}</h2>
          <table>
            <thead>
              <tr>
                <th>{"Name"}</th>
                <th>{"Price"}</th>
                <th>{"Quantity"}</th>
                <th>{"Action"}</th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 ? (
                cart.map((cartProduct, key) => (
                  <tr key={key}>
                    <td>{cartProduct.name}</td>
                    <td>{cartProduct.price}</td>
                    <td>{cartProduct.quantity}</td>
                    <td>
                      <button
                        className="adj-btn"
                        onClick={() =>
                          updateProductQuantity(cartProduct, "increase")
                        }
                      >
                        +
                      </button>

                      <button
                        className="adj-btn"
                        onClick={() =>
                          updateProductQuantity(cartProduct, "decrease")
                        }
                      >
                        -
                      </button>

                      <button className="remove-btn">X</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">{"No Item In Cart"}</td>
                </tr>
              )}
            </tbody>
          </table>

          <h3>
            {"Total Amount"}: ${totalAmount.toFixed(2)}
          </h3>
          {totalAmount !== 0 ? (
            <button className="checkout-btn">{"Checkout"}</button>
          ) : (
            <p>{"Please Add Product"}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
