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
      fetchProducts();
      alert("Product Added Successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("ErrorAddingProduct");
    }
  };

// I extracted fetchproducts to outside so it can auto update, delete or add products
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



// I have extracted the fetchProducts from useEffect to be used outside
useEffect(() => {
  fetchProducts();
}, []);

  // it sets the editingProduct state to the product that is being edited
  const [editingProduct, setEditingProduct] = useState(null);

  // edit the product
  const handleEditProduct = async (product) => {

    setEditingProduct(product);
    // set the new product state to be the product that is being edited
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
      // set the new product state to be empty
      setNewProduct({
        category: "",
        active: true,
        description: "",
        image: "",
        price: 0,
        name: "",
      });
      fetchProducts();
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
      fetchProducts();
      alert("Product Deleted Successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error Deleting Product");
    }
  };
  
  return (
    // return the JSX for the EditProductPage component
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
      {editingProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4 text-white">
              {"Edit Product"}
            </h2>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block font-semibold mb-1 text-white"
              >
                {"name"}
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
                {"category"}
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
                {"description"}
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
                {"imageURL"}
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
                {"price"}
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
                onClick={() => setEditingProduct(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors duration-300 mr-2"
              >
                {"cancel"}
              </button>
              <button
                onClick={handleUpdateProduct}
                className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-300"
              >
                {"updateProduct"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProductPage;
