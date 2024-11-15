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
  const [change, setChange] = useState(0);
  const { t } = useLanguage();

  // it's used for updating the current date every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update the date every second

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);
  const handleReset = () => {
    setCashAmount(0);
    setVoucherAmount(0);
    updateChange(0, 0);
  };

  const handleAllCash = () => {
    setCashAmount(totalAmount);
    setVoucherAmount(0);
    updateChange(totalAmount, 0);
  };

  const handleAllVoucher = () => {
    setCashAmount(0);
    setVoucherAmount(totalAmount);
    updateChange(0, totalAmount);
  };

  const handleCashIncrement = (amount) => {
    const newAmount = Math.max(0, cashAmount + amount);
    setCashAmount(newAmount);
    updateChange(newAmount, voucherAmount);
  };

  const handleVoucherIncrement = (amount) => {
    const newAmount = Math.min(
      Math.max(0, voucherAmount + amount),
      totalAmount
    );
    setVoucherAmount(newAmount);
    updateChange(cashAmount, newAmount);
  };
  
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
    const value = e.target.value;
    // If empty or non-numeric, set to 0
    if (value === '' || isNaN(value)) {
      setCashAmount(0);
      updateChange(0, voucherAmount);
      return;
    }
    
    const newCashAmount = Math.max(0, parseFloat(value));
    setCashAmount(newCashAmount);
    updateChange(newCashAmount, voucherAmount);
  };

  // Modified voucher amount handler to prevent negative values and exceed total amount
  const handleVoucherAmountChange = (e) => {
    const value = e.target.value;
    // If empty or non-numeric, set to 0
    if (value === '' || isNaN(value)) {
      setVoucherAmount(0);
      updateChange(cashAmount, 0);
      return;
    }
    
    // Limit voucher amount to not exceed total amount
    const parsedValue = parseFloat(value);
    const newVoucherAmount = Math.min(
      Math.max(0, parsedValue), // Ensure non-negative
      totalAmount // Limit to total amount
    );
    
    setVoucherAmount(newVoucherAmount);
    updateChange(cashAmount, newVoucherAmount);
  };

  const updateChange = (cash, voucher) => {
    const totalPayment = cash + voucher;
    const newChange = totalPayment - totalAmount;
    setChange(newChange >= 0 ? newChange : 0);
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
        price: item.price,
      }));
  
      // Calculate the actual amounts paid, using voucher first
      let actualVoucherAmount = Math.min(voucherAmount, totalAmount);
      let actualCashAmount = Math.min(cashAmount, totalAmount - actualVoucherAmount);
  
      const transactionData = {
        order_id,
        order_items,
        total_amount: totalAmount,
        cash_amount: actualCashAmount,
        voucher_amount: actualVoucherAmount,
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
        setChange(totalPayment - totalAmount); // Set the correct change amount
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
      alert(t("insufficientPayment"));
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
    const newTotalAmount = cart.reduce(
      (acc, curr) => acc + curr.totalAmount,
      0
    );
    setTotalAmount(newTotalAmount);
    // Removed the automatic setting of cash amount
  }, [cart]);

  return (
    <div className="order-page">
      <header className="page-header">
        <h1 className="page-heading-1">{t("connexionCafe")}</h1>
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
              <h2>{t("orderSummary")}</h2>
              <table>
                <thead>
                  <tr>
                    <th>{t("name")}</th>
                    <th>{t("price")}</th>
                    <th>{t("quantity")}</th>
                    <th>{t("action")}</th>
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
                      <td colSpan="4">{t("noItemInCart")}</td>
                    </tr>
                  )}
                </tbody>
              </table>
  
              <h3>
                {t("totalAmount")}: ${totalAmount.toFixed(2)}
              </h3>
              {totalAmount !== 0 ? (
                <button className="checkout-btn" onClick={handleCheckout}>
                  {t("checkout")}
                </button>
              ) : (
                <p>{t("pleaseAddProduct")}</p>
              )}
            </div>
          </>
        ) : (
          <div className="payment-section w-full max-w-xl mx-auto bg-gray-800 p-8 rounded-lg text-white">
  <div className="text-center mb-6">
    <p className="text-xl">Total Amount: <span className="text-green-400">${totalAmount.toFixed(2)}</span></p>
  </div>

  <div className="grid grid-cols-2 gap-8">
    {/* Left side - Cash */}
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full space-y-2">
        <button 
          onClick={() => handleCashIncrement(10)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md w-full"
        >
        X10
        </button>
        <button 
          onClick={() => handleCashIncrement(1)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md w-full"
        >
          ↑
        </button>
      </div>
      
      <div className="text-center">
        <label className="block text-lg mb-2">Cash:</label>
        <input
          type="number"
          value={cashAmount}
          onChange={handleCashAmountChange}
          min="0"
          step="0.01"
          className="w-24 bg-gray-700 text-white px-3 py-2 rounded-md text-center"
        />
      </div>

      <div className="w-full space-y-2">
        <button 
          onClick={() => handleCashIncrement(-1)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md w-full"
        >
          ↓
        </button>
        <button 
          onClick={() => handleCashIncrement(-10)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md w-full"
        >
          X10
        </button>
      </div>
    </div>

    {/* Right side - Voucher */}
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full space-y-2">
        <button 
          onClick={() => handleVoucherIncrement(10)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md w-full"
        >
          X10
        </button>
        <button 
          onClick={() => handleVoucherIncrement(1)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md w-full"
        >
          ↑
        </button>
      </div>

      <div className="text-center">
        <label className="block text-lg mb-2">Voucher:</label>
        <input
          type="number"
          value={voucherAmount}
          onChange={handleVoucherAmountChange}
          min="0"
          max={totalAmount}
          step="0.01"
          className="w-24 bg-gray-700 text-white px-3 py-2 rounded-md text-center"
        />
      </div>

      <div className="w-full space-y-2">
        <button 
          onClick={() => handleVoucherIncrement(-1)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md w-full"
        >
          ↓
        </button>
        <button 
          onClick={() => handleVoucherIncrement(-10)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md w-full"
        >
          X10
        </button>
      </div>
    </div>
  </div>

  <div className="mt-8 grid grid-cols-3 gap-4">
    <button
      onClick={handleAllCash}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
    >
      All Cash
    </button>
    <button
      onClick={handleAllVoucher}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
    >
      All Voucher
    </button>
    <button
      onClick={handleReset}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
    >
      Reset
    </button>
  </div>

  <div className="mt-6 bg-gray-700 p-4 rounded-lg">
    <div className="flex justify-between items-center">
      <span className="text-xl font-semibold">Change:</span>
      <span className="text-2xl font-bold text-yellow-400">
        ${change.toFixed(2)}
      </span>
    </div>
  </div>

  <div className="mt-6 flex justify-between">
    <button
      onClick={handleCancel}
      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
    >
      Cancel
    </button>
    <button
      onClick={handleConfirmPayment}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={cashAmount + voucherAmount < totalAmount || voucherAmount > totalAmount}
    >
      Confirm Payment
    </button>
  </div>
</div>
        )}
  
        {showOrderSummary && (
          <OrderSummary
            orderNumber={orderNumber}
            orderItems={orderItems}
            onContinue={handleContinue}
            changeAmount={change}

          />
        )}
      </div>
    </div>
  );
};

export default OrderPage;
