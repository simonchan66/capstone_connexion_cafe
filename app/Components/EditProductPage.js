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
              name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              //value={newProduct.name}
              //onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block font-semibold mb-1 text-white"
            >
              category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              //value={newProduct.category}
              //onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block font-semibold mb-1 text-white"
            >
              description
            </label>
            <textarea
              id="description"
              name="description"
              //value={newProduct.description}
              //onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block font-semibold mb-1 text-white"
            >
              imageURL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              //value={newProduct.image}
              //onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block font-semibold mb-1 text-white"
            >
              price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              //value={newProduct.price}
              //onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              //onClick={handleAddProduct}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-300"
            >
              addProduct
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
                <th className="px-4 py-2 text-left text-gray-400">name</th>
                <th className="px-4 py-2 text-left text-gray-400">category</th>
                <th className="px-4 py-2 text-left text-gray-400">price</th>
                <th className="px-4 py-2 text-left text-gray-400">actions</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
