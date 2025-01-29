import Razorpay from 'razorpay';

// Initialize Razorpay with your key
const razorpay = new Razorpay({
  key_id: 'rzp_live_QginVE64NUmu8B',  // Public Razorpay key
  key_secret: 'OTEpD9F4ojcVztosVTiJNaN4',  // Private Razorpay key (do not expose this to the frontend)
});

export async function POST(req) {
  try {
    const { amount } = await req.json();  // Fetch the amount from the request body

    // Convert amount to paisa (Razorpay expects amount in paisa)
    const options = {
      amount: amount * 100,  // Convert to paisa
      currency: 'INR',
      receipt: `receipt_${new Date().getTime()}`,
    };

    // Create the Razorpay order
    const order = await razorpay.orders.create(options);

    // Return the order object (including the order ID and amount) to the frontend
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return new Response(JSON.stringify({ error: 'Error creating Razorpay order' }), { status: 500 });
  }
}
