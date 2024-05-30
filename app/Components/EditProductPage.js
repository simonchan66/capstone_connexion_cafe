"use client";
import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const EditProductPage = () => {
  // Alls functions are written with assistance from github Copilot
  // set the new product state to be empty
  const [newProduct, setNewProduct] = useState({
    category: "",
    active: true,
    description: "",
    image: "",
    price: 0,
    name: "",
  });

  //set the products state to be empty
  const [products, setProducts] = useState([]);

  // it updates the state of newProduct whenever any input field's value change
  const handleInputChange = (e) => {
    // destructure name and value from the input field
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // it adds the new product to the firestore database products collection
  const handleAddProduct = async () => {
    const db = getFirestore();
    const colRef = collection(db, "products");

    try {
      // colRef is the collection reference to the products collection
      await addDoc(colRef, {
        ...newProduct,
        price: parseFloat(newProduct.price),
      });
      setNewProduct({
        category: "",
        active: true,
        description: "",
        image: "",
        price: 0,
        name: "",
      });
      alert("Product Added Successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("ErrorAddingProduct");
    }
  };

  // Fetch products list from firestore database, directly copy from orderpage.js
  // stored in the products state
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

  const handleEditProduct = async (product) => {
    //to be continued
  };

  const handleDeleteProduct = async (id) => {
    //to be continued
  };

  return (
    <div className="edit-product-page">
      <header className="page-header">
        <h1 className="page-heading-1">Edit Products</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="page-heading-2">Add New Product</h2>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block font-semibold mb-1 text-white"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block font-semibold mb-1 text-white"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block font-semibold mb-1 text-white"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block font-semibold mb-1 text-white"
            >
              ImageURL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={newProduct.image}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block font-semibold mb-1 text-white"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end">
            <button onClick={handleAddProduct} className="page-button">
              Add Product
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">
            Existing Products
          </h2>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-400">Name</th>
                <th className="px-4 py-2 text-left text-gray-400">Category</th>
                <th className="px-4 py-2 text-left text-gray-400">Price</th>
                <th className="px-4 py-2 text-left text-gray-400">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                // map through the products array and display each product in a table row
                <tr key={product.id} className="border-b border-gray-700">
                  <td className="px-4 py-2 text-white">{product.name}</td>
                  <td className="px-4 py-2 text-white">{product.category}</td>
                  <td className="px-4 py-2 text-white">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 flex">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="button-edit"
                    >
                      {"Edit"}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="button-delete"
                    >
                      {"Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
