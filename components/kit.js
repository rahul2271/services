"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    product: "",
    variant: "25 Medicines Set",
    price: 2000,
  });

  const [selectedVariant, setSelectedVariant] = useState("25 Medicines Set");

  useEffect(() => {
    const formSection = document.getElementById("form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedVariant]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVariantChange = (variant) => {
    const price = variant === "25 Medicines Set" ? 2000 : 3000;
    setSelectedVariant(variant);
    setFormData({ ...formData, variant, price });
  };

  const handlePaymentSuccess = async (paymentData) => {
    console.log("Payment success:", paymentData);
  };

  const handlePaymentFailure = (error) => {
    console.error("Payment failed:", error);
  };

  const initiatePayment = () => {
    const options = {
      key: "rzp_live_QginVE64NUmu8B",
      amount: formData.price * 100,
      currency: "INR",
      name: "Your Store",
      description: formData.variant,
      image: "https://example.com/logo.png",
      handler: handlePaymentSuccess,
      prefill: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      theme: {
        color: "#ff6347",
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/kit-p", formData);

      if (response.status === 200) {
        initiatePayment();
      } else {
        console.error("Error saving order:", response);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-12 px-6 md:px-12">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-semibold text-center text-white mb-12 drop-shadow-lg"
      >
        Homoeopathy Medicine Set
      </motion.h1>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <div className="flex flex-col md:flex-row items-center">
          <img
            src="/images/product-main.jpg"
            alt="Homoeopathy Medicine Set"
            className="w-full md:w-1/2 h-auto object-cover rounded-lg mb-6 md:mb-0"
          />
          <div className="md:ml-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Premium Homoeopathic Medicine</h2>
            <p className="text-gray-600 mb-6">
              Our Homoeopathy Medicine Set combines the finest natural ingredients to help you lead a healthier life. Choose your preferred variant below.
            </p>

            <div className="flex space-x-4">
              {[
                { name: "25 Medicines Set", price: 2000 },
                { name: "45 Medicines Set", price: 3000 },
              ].map((variant, index) => (
                <button
                  key={index}
                  onClick={() => handleVariantChange(variant.name)}
                  className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                    selectedVariant === variant.name
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>

            <p className="mt-4 text-xl text-gray-800 font-semibold">
              Price: ₹{formData.price}
            </p>
          </div>
        </div>
      </div>

      <motion.div
        id="form-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-16 max-w-3xl mx-auto bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg shadow-2xl p-8"
      >
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Customer Details</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone" className="text-gray-700 font-semibold mb-2">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Your Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex flex-col sm:col-span-2">
              <label htmlFor="address" className="text-gray-700 font-semibold mb-2">Address</label>
              <textarea
                id="address"
                name="address"
                placeholder="Your Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="3"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            Proceed to Payment
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="mt-16 max-w-5xl mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-xl p-8 text-center"
      >
        <h2 className="text-3xl font-semibold text-white mb-6">Product Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xl text-yellow-200 font-semibold">Premium Ingredients</h4>
            <p className="text-white">
              Our medicines are made using authentic Homoeopathy ingredients.
            </p>
          </div>
          <div>
            <h4 className="text-xl text-yellow-200 font-semibold">Guaranteed Results</h4>
            <p className="text-white">
              Trusted by thousands for quality and effective results.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="mt-16 max-w-5xl mx-auto bg-white rounded-lg shadow-xl p-8"
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Courier & Shipping Information</h2>
        <p className="text-gray-600 mb-4">
          Fast and reliable shipping available across India. Courier services include Bluedart, DTDC, and others.
        </p>
        <p className="text-gray-600">
          Delivery time: 3-5 business days for most locations.
        </p>
      </motion.div>
    </div>
  );
};

export default ProductPage;
