import { useState, useEffect } from "react";
import axios from "axios";
import cashIcon from "../../assets/PaymentForm/ion_cash (1).png";
import visaIcon from "../../assets/PaymentForm/Vector (7).png";
import { toast } from "react-toastify";
import { API_URL } from "../../context/api/Api";

interface BookingItem {
  id: number;
  final_price: number | string;
  car_model: {
    id: number;
  };
}

interface PaymentFormProps {
  booking: BookingItem;
  onPaymentSuccess: () => void;
}

const PaymentForm = ({ booking, onPaymentSuccess }: PaymentFormProps) => {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState<"cash" | "card" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Save payment method to your API
  const savePaymentMethod = async (payment_method: string, transaction_id: string | null) => {
    try {
      const token = localStorage.getItem("tokenUser");
      if (!token) {
        toast.error("You must be logged in first");
        return;
      }
      await axios.post(
        `${API_URL}/api/user/Model/${booking.car_model.id}/car-booking/${booking.id}/payment-method`,
        { payment_method, transaction_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      confirm("Payment recorded successfully");
      onPaymentSuccess();
    } catch (error: any) {
      toast.error("An error occurred while recording the payment");
      console.error("Save Payment Error:", error.response?.data || error.message);
    }
  };

  // Handle messages from Paymob iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://accept.paymob.com") return;

      const data = event.data;
      console.log("Message from Paymob iframe:", data);

      if (data?.event === "payment_success" || data?.success === true) {
        savePaymentMethod("visa", data.transaction?.id || null);
        setIframeUrl(null);
        setActiveMethod(null);
      } else if (data?.event === "payment_failed") {
        toast.error("Payment failed, please try again");
        setIframeUrl(null);
        setActiveMethod(null);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Pay with cash
  const handleCashPayment = async () => {
    setIsLoading(true);
    setActiveMethod("cash");
    await savePaymentMethod("cash", null);
    setIsLoading(false);
    setActiveMethod(null);
  };

  // Pay with card via Paymob
  const handleCardPayment = async () => {
    setIsLoading(true);
    setActiveMethod("card");

    try {
      const apiKey = import.meta.env.VITE_PAYMOB_API_KEY;
      const integrationId = import.meta.env.VITE_PAYMOB_INTEGRATION_ID;

      if (!apiKey || !integrationId) {
        toast.error("API Key or Integration ID is missing");
        setIsLoading(false);
        setActiveMethod(null);
        return;
      }

      // Step 1: Get auth token
      const authRes = await axios.post("https://accept.paymob.com/api/auth/tokens", {
        api_key: apiKey,
      });
      const authToken = authRes.data.token;
      if (!authToken) throw new Error("Failed to get auth token");

      // Step 2: Create order
      const orderRes = await axios.post("https://accept.paymob.com/api/ecommerce/orders", {
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: Math.round(Number(booking.final_price) * 100),
        currency: "EGP",
        items: [],
      });
      const orderId = orderRes.data.id;
      if (!orderId) throw new Error("Failed to create order");

      // Step 3: Request payment key
      const paymentKeyRes = await axios.post("https://accept.paymob.com/api/acceptance/payment_keys", {
        auth_token: authToken,
        amount_cents: Math.round(Number(booking.final_price) * 100),
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: "NA",
          email: "user@example.com",
          floor: "NA",
          first_name: "Test",
          street: "Test Street",
          building: "NA",
          phone_number: "+201000000000",
          shipping_method: "NA",
          postal_code: "NA",
          city: "Cairo",
          country: "EG",
          last_name: "User",
          state: "Cairo",
        },
        currency: "EGP",
        integration_id: integrationId,
      });

      const paymentToken = paymentKeyRes.data.token;
      if (!paymentToken) throw new Error("Failed to get payment token");

      const iframe = `https://accept.paymob.com/api/acceptance/iframes/943449?payment_token=${paymentToken}`;
      setIframeUrl(iframe);
    } catch (error: any) {
      toast.error("An error occurred while preparing the payment");
      console.error("Card Payment Error:", error.response?.data || error.message);
      setActiveMethod(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseIframe = () => {
    setIframeUrl(null);
    setActiveMethod(null);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Select Payment Method</h1>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <button
          onClick={handleCashPayment}
          disabled={isLoading && activeMethod !== "cash"}
          className={`bg-[#E6911E] text-white px-6 py-2 rounded-lg shadow flex justify-center items-center gap-10 transition-all
            ${isLoading && activeMethod !== "cash" ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e6911eb3]"}`}
        >
          <img src={cashIcon} alt="Cash" className="w-8 h-8" />
          {isLoading && activeMethod === "cash" ? "Paying in Cash..." : "Pay in Cash"}
        </button>

        <button
          onClick={handleCardPayment}
          disabled={isLoading && activeMethod !== "card"}
          className={`bg-[#E6911E] text-white px-6 py-2 rounded-lg shadow flex justify-center items-center gap-10 transition-all
            ${isLoading && activeMethod !== "card" ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e6911eb3]"}`}
        >
          <img src={visaIcon} alt="Credit Card" className="w-8 h-8" />
          {isLoading && activeMethod === "card" ? "Paying with Card..." : "Pay with Card"}
        </button>
      </div>

      {iframeUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative">
            <button
              onClick={handleCloseIframe}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 z-10"
              aria-label="Close Payment"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              src={iframeUrl}
              title="Secure Payment Gateway"
              width="100%"
              height="700px"
              className="rounded-lg"
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
