"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const BookingPage = () => {
  const [patientName, setPatientName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [selectedService, setSelectedService] = useState("curabilityTest");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [faqOpen, setFaqOpen] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = {
      patientName,
      email,
      contact,
      selectedService,
      status: "pending",
    };

    try {
      const sheetDbResponse = await fetch("https://sheetdb.io/api/v1/vee4mnfx2iacp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const razorpayResponse = await fetch("/api/razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount:
            selectedService === "curabilityTest"
              ? 200
              : selectedService === "consultation"
              ? 1000
              : 1300,
        }),
      });

      const [sheetDbResult, razorpayResult] = await Promise.all([
        sheetDbResponse,
        razorpayResponse,
      ]);

      if (sheetDbResult.ok && razorpayResult.ok && razorpayLoaded) {
        const razorpayData = await razorpayResult.json();

        const options = {
          key: "rzp_live_QginVE64NUmu8B",
          amount: razorpayData.amount,
          currency: "INR",
          name: "Dr. Jyotika Kapoor",
          description: "Homeopathy Treatment Booking",
          order_id: razorpayData.id,
          handler: function (response) {
            setLoading(false);
            setMessage("Payment successful! Payment ID: " + response.razorpay_payment_id);
            setMessageType("success");
          },
          prefill: {
            name: patientName,
            email,
            contact,
          },
          theme: {
            color: "#4F46E5",
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        setLoading(false);
        setMessage("Something went wrong! Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      setMessage("An error occurred! Please try again.");
      setMessageType("error");
    }
  };

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
    <section className="relative bg-cover bg-center pt-[200px] md:h-[400px]  flex items-center justify-center text-white">
      {/* Blurred Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/mint-leaf.jpg" // Replace with the path to your image
          alt="Background"
          layout="fill"
          objectFit="cover"
  className="opacity-50 blur-sm"
          priority // Loads the image as a priority for the hero section
           // Tailwind's blur utility
        />
       
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4">
          Your Path to Healing Starts Here
        </h1>
        <p className="text-lg text-gray-600 md:text-2xl">
          Personalized Homeopathy Consultations with Dr. Jyotika Kapoor
        </p>
      </div>
    </section>

      {/* Services Section */}
      <section className="py-16 bg-gradient-to-b from-[#c7dd7c] to-white text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl text-green-900 font-bold mb-8">Our Services & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Curability Test",
                price: "₹200",
                description:
                  "A test to understand your condition’s curability. Ideal for new patients seeking insight into their health journey.",
              },
              {
                title: "Consultation",
                price: "₹1000",
                description:
                  "Personalized consultation with Dr. Jyotika Kapoor. Get a comprehensive treatment plan based on your specific health needs.",
              },
              {
                title: "Monthly Medicinal Charges",
                price: "₹1300",
                description:
                  "Follow-up session for patients undergoing treatment. Track your progress and make adjustments as needed.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white text-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transform transition"
              >
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-lg font-bold text-purple-600 mb-4">
                  {service.price}
                </p>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Book Your Appointment
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-100 p-8 rounded-xl shadow-lg space-y-6"
          >
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Select Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="curabilityTest">Curability Test - ₹200</option>
                <option value="consultation">Consultation - ₹1000</option>
                <option value="followUp">Monthly Medicinal Charges - ₹1300</option>
              </select>
            </div>
            <button
              type="submit"
              className={`w-full py-3 text-lg font-semibold text-white bg-green-700 rounded-lg hover:bg-green-700 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </form>

          {message && (
            <div
              className={`mt-6 p-4 rounded-lg text-center ${
                messageType === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {["What is a Curability Test?", "How long will the consultation take?", "Can I book multiple sessions?"].map(
              (question, index) => (
                <div key={index} className="border-b">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left text-lg font-semibold text-gray-800 py-2"
                  >
                    {question}
                  </button>
                  {faqOpen === index && (
                    <p className="text-gray-600 mt-2">
                      {index === 0
                        ? "The Curability Test helps assess your condition and determine whether homeopathy can be an effective treatment option for you."
                        : index === 1
                        ? "A typical consultation lasts between 30-45 minutes, depending on the complexity of your health needs."
                        : "Yes, you can book multiple sessions as required for follow-up treatments or additional consultations."}
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;
