"use client";
import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import OrderSummary from "./OrderSummary";
import { useLanguage } from "../_utils/LanguageContext";

const OrderPage = () => {
  const [products, setProducts] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [checkoutClicked, setCheckoutClicked] = useState(false);
  const [cashAmount, setCashAmount] = useState(0);
  const [voucherAmount, setVoucherAmount] = useState(0);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderItems, setOrderItems] = useState([]);

  const { t } = useLanguage();

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

    // if the product exists in the cart, update the quantity and total amount
    if (productIndex !== -1) {
      // if the action is increase, increase the quantity and total amount
      if (action === "increase") {
        newCart[productIndex].quantity += 1;
        newCart[productIndex].totalAmount += product.price;
        // if the action is decrease, decrease the quantity and total amount
      } else if (action === "decrease") {
        if (newCart[productIndex].quantity > 1) {
          newCart[productIndex].quantity -= 1;
          newCart[productIndex].totalAmount -= product.price;
        } else {
          // if the action is decrease and the quantity is 1, remove the product from the cart
          newCart.splice(productIndex, 1);
        }
      }
    }

    setCart(newCart);
  };

  const handleCheckout = () => {
    setCheckoutClicked(true);
  };

  // Cancel the payment and reset the state variables
  const handleCancel = () => {
    setCheckoutClicked(false);
    setCashAmount(0);
    setVoucherAmount(0);
  };

  const handleCashAmountChange = (e) => {
    setCashAmount(parseFloat(e.target.value));
  };

  const handleVoucherAmountChange = (e) => {
    setVoucherAmount(parseFloat(e.target.value));
  };

  // confirm payment and send data to firestore
  // Assitance from github Copilot

  const handleConfirmPayment = async () => {
    const totalPayment = cashAmount + voucherAmount;
    if (totalPayment >= totalAmount) {
      // Create a new transaction document for firestore
      const transaction_time = new Date();
      const order_id = `${transaction_time.getSeconds()}${transaction_time.getMinutes()}${transaction_time.getHours()}${
        transaction_time.getMonth() + 1
      }${transaction_time.getDate()}${transaction_time.getFullYear()}`;

      const order_items = cart.map((item) => ({
        item_name: item.name,
        quantity: item.quantity,
      }));

      const transactionData = {
        order_id,
        order_items,
        total_amount: totalAmount,
        cash_amount: cashAmount,
        voucher_amount: voucherAmount,
        // will use other user data in the future
        user_name: "default",
        transaction_time: transaction_time.toISOString(),
        done: false,
      };

      try {
        const db = getFirestore();
        const transactionsRef = collection(db, "transactions");
        await addDoc(transactionsRef, transactionData);
        console.log("Transaction added to Firestore");

        // Extract the first 3 numbers of the order ID, which is the time of transaction
        const orderNumber = order_id.slice(0, 3);
        setOrderNumber(orderNumber);
        setOrderItems(order_items);
        setShowOrderSummary(true);
      } catch (error) {
        console.error("Error adding transaction to Firestore:", error);
      }

      // Reset state variables
      console.log("Payment confirmed");
      setCheckoutClicked(false);
      setCart([]);
      setTotalAmount(0);
      setCashAmount(0);
      setVoucherAmount(0);
    } else {
      alert("Insufficient payment amount.");
    }
  };

  // Continue button of the order summary
  const handleContinue = () => {
    setShowOrderSummary(false);
    setOrderNumber("");
    setOrderItems([]);
  };
  // Remove product from the cart
  const removeProduct = async (product) => {
    const newCart = cart.filter((cartItem) => cartItem.id !== product.id);
    setCart(newCart);
  };

  useEffect(() => {
    // Calculate new total amount
    const newTotalAmount = cart.reduce(
      (acc, curr) => acc + curr.totalAmount,
      0
    );
    setTotalAmount(newTotalAmount);
    setCashAmount(newTotalAmount); // Set cash amount to total amount
  }, [cart]); // Update total amount when cart changes

  return (
    <div className="order-page">
      <header className="page-header">
        <h1 className="page-heading-1">Connexion Cafe</h1>
        <p>{t("test")}</p>
        <p>{currentDate.toLocaleString()}</p>
      </header>

      <div className="order-content">
        {!checkoutClicked ? (
          <>
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

                          <button
                            className="remove-btn"
                            onClick={() => removeProduct(cartProduct)}
                          >
                            X
                          </button>
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
                <button className="checkout-btn" onClick={handleCheckout}>
                  {"Checkout"}
                </button>
              ) : (
                <p>{"Please Add Product"}</p>
              )}
            </div>
          </>
        ) : (
          <div className="payment-section bg-gray-800 p-6 rounded-lg text-white max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">{"Payment"}</h2>
            <div>
              <p className="mb-2">{"Payment Details"}:</p>
              <p className="mb-2">
                {"Total Amount"}: ${totalAmount.toFixed(2)}
              </p>
              <div className="mb-4">
                <label htmlFor="cashAmount" className="block mb-1">
                  {"Amount Paid By Cash"}:
                </label>
                <input
                  type="number"
                  id="cashAmount"
                  value={cashAmount}
                  onChange={handleCashAmountChange}
                  className="bg-black text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="voucherAmount" className="block mb-1">
                  {"Amount Paid By Voucher"}:
                </label>
                <input
                  type="number"
                  id="voucherAmount"
                  value={voucherAmount}
                  onChange={handleVoucherAmountChange}
                  className="bg-black text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end">
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors duration-300 mr-2"
              >
                {"Cancel"}
              </button>
              <button
                onClick={handleConfirmPayment}
                className="checkout-btn text-white px-4 py-2 rounded-md transition-colors duration-300"
                disabled={cashAmount + voucherAmount !== totalAmount}
              >
                {"Confirm Payment"}
              </button>
            </div>

            <div>
              {cashAmount + voucherAmount !== totalAmount && (
                <p className="text-red-500 mb-4">{"Error Total Amount"}</p>
              )}
            </div>
          </div>
        )}

        {showOrderSummary && (
          <OrderSummary
            orderNumber={orderNumber}
            orderItems={orderItems}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
};

export default OrderPage;
