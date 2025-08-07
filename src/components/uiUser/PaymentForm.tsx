import { useState } from "react";
import { API_URL } from "../../context/api/Api";
import cashIcon from "../../assets/PaymentForm/ion_cash (1).png";
import visaIcon from "../../assets/PaymentForm/Vector (7).png";
import axios from "axios";

const PaymobButton = ({ bookingId, modelId }: { bookingId: number; modelId: number }) => {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMethod, setActiveMethod] = useState<"cash" | "card" | null>(null);

  const savePaymentMethod = async ({
    payment_method,
    transaction_id,
  }: {
    payment_method: string;
    transaction_id: string | null;
  }) => {
    try {
      const res = await axios.post(
        `/api/user/Model/${modelId}/car-booking/${bookingId}/payment-method`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("tokenUser")}`,
          },
          body: JSON.stringify({
            payment_method,
            transaction_id,
          }),
        }
      );

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.message || "Failed to save payment method");
      }

      alert("Payment method saved successfully!");
      return result;
    } catch (err) {
      console.error("Error saving payment method:", err);
      alert("Failed to save payment details");
      throw err;
    }
  };

  const handleCashPayment = async () => {
    try {
      setIsLoading(true);
      setActiveMethod("cash");
      await savePaymentMethod({
        payment_method: "cash",
        transaction_id: null,
      });
      setIframeUrl(null);
    } catch (error) {
      console.error("Cash payment error:", error);
    } finally {
      setIsLoading(false);
      setActiveMethod(null);
    }
  };

  const handleCardPayment = async () => {
    setIsLoading(true);
    setActiveMethod("card");
    try {
      const authResponse = await axios.post(
        "https://accept.paymob.com/api/auth/tokens",
        {
          api_key: API_URL,
        }
      );

      if (!authResponse.data.token) {
        throw new Error("Failed to get authentication token");
      }

      const token = authResponse.data.token;

      const orderResponse = await axios.post(
        "https://accept.paymob.com/api/ecommerce/orders",
        {
          auth_token: token,
          delivery_needed: false,
          amount_cents: "10000", 
          currency: "EGP",
          items: [],
        }
      );

      if (!orderResponse.data.id) {
        throw new Error("Failed to create order");
      }

      const paymentKeyResponse = await axios.post(
        "https://accept.paymob.com/api/acceptance/payment_keys",
        {
          auth_token: token,
          amount_cents: "10000",
          expiration: 3600,
          order_id: orderResponse.data.id,
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
          integration_id: 5212114, 
        }
      );

      if (!paymentKeyResponse.data.token) {
        throw new Error("Failed to get payment token");
      }

      const iframe = `https://accept.paymob.com/api/acceptance/iframes/943449?payment_token=${paymentKeyResponse.data.token}`;
      setIframeUrl(iframe);

    } catch (error) {
      console.error("Payment processing error:", error);
      alert("An error occurred during payment processing. Please try again.");
    } finally {
      setIsLoading(false);
      if (!iframeUrl) {
        setActiveMethod(null);
      }
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
          {isLoading && activeMethod === "cash" ? (
            <span>Processing...</span>
          ) : (
            <span>Pay with Cash</span>
          )}
        </button>

        <button
          onClick={handleCardPayment}
          disabled={isLoading && activeMethod !== "card"}
          className={`bg-[#E6911E] text-white px-6 py-2 rounded-lg shadow flex justify-center items-center gap-10 transition-all
            ${isLoading && activeMethod !== "card" ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e6911eb3]"}`}
        >
          <img src={visaIcon} alt="Credit Card" className="w-8 h-8" />
          {isLoading && activeMethod === "card" ? (
            <span>Processing...</span>
          ) : (
            <span>Pay with Credit Card</span>
          )}
        </button>
      </div>

      {iframeUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative">
            <button
              onClick={handleCloseIframe}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 z-10"
              aria-label="Close payment"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymobButton;