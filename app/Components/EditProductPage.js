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

  // it sets the editingProduct state to the product that is being edited
  const [editingProduct, setEditingProduct] = useState(null);

  // edit the product
  const handleEditProduct = async (product) => {
    setEditingProduct(product);
    setNewProduct({
      category: product.category,
      active: product.active,
      description: product.description,
      image: product.image,
      price: product.price,
      name: product.name,
    });
  };

  // it updates the product in the firestore database products collection
  const handleUpdateProduct = async () => {
    const db = getFirestore();
    const productRef = doc(db, "products", editingProduct.id);

    try {
      await updateDoc(productRef, {
        ...newProduct,
        price: parseFloat(newProduct.price),
      });
      setEditingProduct(null);
      setNewProduct({
        category: "",
        active: true,
        description: "",
        image: "",
        price: 0,
        name: "",
      });
      alert("Product Updated Successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error Updating Product");
    }
  };

  // it deletes the product from the firestore database products collection
  const handleDeleteProduct = async (productId) => {
    const db = getFirestore();
    // doc is a function that creates a reference to a document in the firestore database
    const productRef = doc(db, "products", productId);

    try {
      // deleteDoc is a function that deletes a document from the firestore database
      await deleteDoc(productRef);
      alert("Product Deleted Successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error Deleting Product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Edit Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">
            Add New Product
          </h2>
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
            <button
              onClick={handleAddProduct}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-300"
            >
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
                      className="bg-indigo-500 text-white px-2 py-1 rounded-md hover:bg-indigo-600 transition-colors duration-300 mr-2"
                    >
                      {"Edit"}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors duration-300"
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
