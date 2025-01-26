"use client";
import { useState, useEffect } from 'react';

const BookingPage = () => {
  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [selectedService, setSelectedService] = useState('curabilityTest');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [loading, setLoading] = useState(false); // For handling button loading state
  const [message, setMessage] = useState(''); // For displaying success/error messages
  const [messageType, setMessageType] = useState(''); // For success/error type
  const [faqOpen, setFaqOpen] = useState(null); // State to manage FAQ toggle

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading state
    setMessage(''); // Reset any previous message

    const formData = {
      patientName,
      email,
      contact,
      selectedService,
      status: 'pending',
    };

    try {
      const sheetDbResponse = await fetch('https://sheetdb.io/api/v1/vee4mnfx2iacp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const razorpayResponse = await fetch('/api/razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedService === 'curabilityTest' ? 200 : selectedService === 'consultation' ? 1000 : 1200,
        }),
      });

      const [sheetDbResult, razorpayResult] = await Promise.all([sheetDbResponse, razorpayResponse]);

      if (sheetDbResult.ok && razorpayResult.ok && razorpayLoaded) {
        const razorpayData = await razorpayResult.json();

        const options = {
          key: 'rzp_live_Y2R2bUj5Utg1vD',
          amount: razorpayData.amount,
          currency: 'INR',
          name: 'Dr. Jyotika Kapoor',
          description: 'Homeopathy Treatment Booking',
          order_id: razorpayData.id,
          handler: function (response) {
            setLoading(false);
            setMessage('Payment successful! Payment ID: ' + response.razorpay_payment_id);
            setMessageType('success');
          },
          prefill: {
            name: patientName,
            email,
            contact,
          },
          theme: {
            color: '#f2b67e',
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        setLoading(false);
        setMessage('Something went wrong! Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      setMessage('An error occurred! Please try again.');
      setMessageType('error');
    }
  };

  // Toggle FAQ item open/close
  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 min-h-screen text-white">
      {/* Hero Section */}
      <section className="flex items-center justify-center h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="text-center z-10 px-4 md:px-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-yellow-400">Your Path to Healing Starts Here</h1>
          <p className="text-lg md:text-2xl mt-4">Personalized Homeopathy Consultations with Dr. Jyotika Kapoor</p>
        </div>
      </section>

      {/* Costing and Service Differences Section */}
      <section className="py-16 px-4 md:px-10 bg-white text-gray-800">
        <h2 className="text-4xl font-bold text-center text-gray-800">Our Services & Pricing</h2>
        <div className="mt-6 text-center">
          <p className="text-lg text-gray-600 mb-4">We offer various services tailored to your needs. Below are the details and pricing for each.</p>
          <div className="flex justify-center space-x-8">
            <div className="w-80 bg-gray-100 p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800">Curability Test</h3>
              <p className="text-gray-600 mt-2">Price: ₹200</p>
              <p className="text-gray-600 mt-2">A test to understand your condition’s curability. Ideal for new patients seeking insight into their health journey.</p>
            </div>
            <div className="w-80 bg-gray-100 p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800">Consultation</h3>
              <p className="text-gray-600 mt-2">Price: ₹1000</p>
              <p className="text-gray-600 mt-2">Personalized consultation with Dr. Jyotika Kapoor. Get a comprehensive treatment plan based on your specific health needs.</p>
            </div>
            <div className="w-80 bg-gray-100 p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800">Follow-up Session</h3>
              <p className="text-gray-600 mt-2">Price: ₹1200</p>
              <p className="text-gray-600 mt-2">Follow-up session for patients undergoing treatment. Track your progress and make adjustments as needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16 px-4 md:px-10 bg-white text-gray-800">
        <h2 className="text-4xl font-bold text-center text-gray-800">Book Your Appointment</h2>
        <div className="mt-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-gray-100 p-8 rounded-lg shadow-xl">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="patientName" className="text-lg font-semibold text-gray-700">Your Name</label>
                <input
                  id="patientName"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-lg font-semibold text-gray-700">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="contact" className="text-lg font-semibold text-gray-700">Contact Number</label>
                <input
                  id="contact"
                  type="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="service" className="text-lg font-semibold text-gray-700">Select Service</label>
                <select
                  id="service"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="curabilityTest">Curability Test - ₹200</option>
                  <option value="consultation">Consultation - ₹1000</option>
                  <option value="followUp">Follow-up Session - ₹1200</option>
                </select>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className={`w-full py-3 text-lg font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                      <span className="ml-2">Processing...</span>
                    </div>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Message Section */}
          {message && (
            <div className={`mt-6 text-center p-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p>{message}</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-10 bg-gray-50">
        <h2 className="text-4xl font-bold text-center text-gray-800">Frequently Asked Questions</h2>
        <div className="mt-6 max-w-2xl mx-auto">
          <div className="space-y-4">
            <div className="border-b">
              <button onClick={() => toggleFaq(1)} className="w-full text-left text-lg font-semibold text-gray-800 py-2">
                What is a Curability Test?
              </button>
              {faqOpen === 1 && (
                <p className="text-gray-600 mt-2">
                  The Curability Test helps assess your condition and determine whether homeopathy can be an effective treatment option for you.
                </p>
              )}
            </div>
            <div className="border-b">
              <button onClick={() => toggleFaq(2)} className="w-full text-left text-lg font-semibold text-gray-800 py-2">
                How long will the consultation take?
              </button>
              {faqOpen === 2 && (
                <p className="text-gray-600 mt-2">
                  A typical consultation lasts between 30-45 minutes, depending on the complexity of your health needs.
                </p>
              )}
            </div>
            <div className="border-b">
              <button onClick={() => toggleFaq(3)} className="w-full text-left text-lg font-semibold text-gray-800 py-2">
                Can I book multiple sessions?
              </button>
              {faqOpen === 3 && (
                <p className="text-gray-600 mt-2">
                  Yes, you can book multiple sessions as required for follow-up treatments or additional consultations.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;
