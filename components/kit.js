"use client";

import React, { useState } from "react";
import axios from "axios";

const ProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    product: "",
    price: 0,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Success handler for payment
  const handlePaymentSuccess = async (paymentData) => {
    console.log("Payment success:", paymentData);
  };

  // Failure handler for payment
  const handlePaymentFailure = (error) => {
    console.error("Payment failed:", error);
  };

  // Initiate Razorpay payment
  const initiatePayment = (productDetails) => {
    const options = {
      key: "rzp_live_Y2R2bUj5Utg1vD", // Your Razorpay key
      amount: productDetails.price * 100, // Amount in paise
      currency: "INR",
      name: "Your Store",
      description: productDetails.name,
      image: "https://example.com/logo.png",
      handler: handlePaymentSuccess,
      prefill: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      theme: {
        color: "#ff6347", // Bright color to stand out
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save data to SheetDB first
      const response = await axios.post("/api/kit-p", formData);

      // After saving to SheetDB, initiate Razorpay payment
      if (response.status === 200) {
        initiatePayment(formData);
      } else {
        console.error("Error saving order:", response);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-12 px-6 md:px-12">
      <h1 className="text-4xl font-semibold text-center text-white mb-12 drop-shadow-lg">
        Premium Ayurvedic Medicine Sets
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product 1 */}
        <div
          className={`bg-white rounded-lg shadow-xl p-6 text-center transition-all transform hover:scale-105 hover:shadow-2xl ${
            selectedProduct === "25 Medicines Set" ? "border-4 border-yellow-500" : ""
          }`}
        >
          <img
            src="/images/25-medicines-set.jpg"
            alt="25 Medicines Set"
            className="w-full h-64 object-cover rounded-md mb-6 transition duration-300 transform hover:scale-105"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">25 Medicines Set</h2>
          <p className="text-xl text-gray-600 mb-4">Price: ₹2000</p>
          <button
            onClick={() =>
              setSelectedProduct("25 Medicines Set") &&
              setFormData({ ...formData, product: "25 Medicines Set", price: 2000 })
            }
            className={`bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-600 transition duration-300 ${
              selectedProduct === "25 Medicines Set" ? "bg-orange-700" : ""
            }`}
          >
            {selectedProduct === "25 Medicines Set" ? "Product Selected" : "Select Product"}
          </button>
        </div>

        {/* Product 2 */}
        <div
          className={`bg-white rounded-lg shadow-xl p-6 text-center transition-all transform hover:scale-105 hover:shadow-2xl ${
            selectedProduct === "45 Medicines Set" ? "border-4 border-yellow-500" : ""
          }`}
        >
          <img
            src="/images/45-medicines-set.jpg"
            alt="45 Medicines Set"
            className="w-full h-64 object-cover rounded-md mb-6 transition duration-300 transform hover:scale-105"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">45 Medicines Set</h2>
          <p className="text-xl text-gray-600 mb-4">Price: ₹3000</p>
          <button
            onClick={() =>
              setSelectedProduct("45 Medicines Set") &&
              setFormData({ ...formData, product: "45 Medicines Set", price: 3000 })
            }
            className={`bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-600 transition duration-300 ${
              selectedProduct === "45 Medicines Set" ? "bg-orange-700" : ""
            }`}
          >
            {selectedProduct === "45 Medicines Set" ? "Product Selected" : "Select Product"}
          </button>
        </div>
      </div>

      {/* Customer Details Form */}
      <div className="mt-16 max-w-xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Customer Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <textarea
              name="address"
              placeholder="Your Address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition duration-300"
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>

      {/* Customer Satisfaction Section */}
      <div className="mt-16 max-w-5xl mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-xl p-8 text-center">
        <h2 className="text-3xl font-semibold text-white mb-6">Customer Satisfaction</h2>
        <p className="text-xl text-white mb-4">
          We are dedicated to providing authentic, high-quality Ayurvedic products with a focus on your well-being.
          Expect quick delivery and unparalleled customer support.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="text-5xl text-yellow-300 mb-4">🚚</div>
            <h4 className="text-xl font-semibold text-white">Fast Delivery</h4>
            <p className="text-white">Delivered within 3-5 business days to your doorstep with tracking.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-5xl text-yellow-300 mb-4">🛡️</div>
            <h4 className="text-xl font-semibold text-white">Satisfaction Guarantee</h4>
            <p className="text-white">
              We offer a 7-day return policy for any dissatisfaction with the product. Your satisfaction is our priority.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-5xl text-yellow-300 mb-4">🔒</div>
            <h4 className="text-xl font-semibold text-white">Authenticity Guaranteed</h4>
            <p className="text-white">
              Our products are 100% authentic and sourced from certified Ayurvedic suppliers.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mt-16 max-w-5xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">What Our Customers Say</h2>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src="/images/testimonial1.jpg"
              alt="Customer 1"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-medium text-gray-800">
                "These Ayurvedic sets have worked wonders for my health. The customer service is fantastic, and the delivery was quick!"
              </p>
              <p className="text-gray-600">- Priya S.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <img
              src="/images/testimonial2.jpg"
              alt="Customer 2"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-medium text-gray-800">
                "I feel so much more energetic after using these Ayurvedic products. Highly recommend them!"
              </p>
              <p className="text-gray-600">- Rajesh K.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
