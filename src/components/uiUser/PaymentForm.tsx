import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import cashIcon from "../../assets/PaymentForm/ion_cash (1).png";
import visaIcon from "../../assets/PaymentForm/Vector (7).png";
import { processPayment } from "../../context/Data/DataUser";

interface PaymentFormProps {
  booking: any;
  onPaymentSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ booking, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [saveInfo, setSaveInfo] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (paymentMethod === "visa") {
        if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardHolderName) {
          throw new Error("Please fill all card details");
        }

        const response = await processPayment(
          booking.car_model.id.toString(),
          booking.id.toString(),
          {
            payment_method: "visa",
            card_details: cardDetails,
            amount: booking.final_price,
            save_payment_info: saveInfo
          }
        );

        if (response.success) {
          onPaymentSuccess();
          navigate(`/booking/payment/booking-success/${booking.id}`);
        } else {
          throw new Error(response.message || "Payment failed");
        }
      } else {
        const response = await processPayment(
          booking.car_model.id.toString(),
          booking.id.toString(),
          {
            payment_method: "cash",
            amount: booking.final_price
          }
        );

        if (response.success) {
          onPaymentSuccess();
          navigate(`/booking/payment/booking-success/${booking.id}`);
        } else {
          throw new Error(response.message || "Payment failed");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during payment");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg px-6 max-w-xl w-full mx-auto">
      <h2 className="text-xl font-bold text-[#E6911E] mb-2">Payment</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 mb-6">
          <div
            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition rounded-lg ${
              paymentMethod === "cash"
                ? "border-[#E6911E] ring-2 ring-[#E6911E] border"
                : "border-gray-200 border"
            }`}
            onClick={() => setPaymentMethod("cash")}
          >
            <div className="flex items-center gap-4">
              <img
                src={cashIcon}
                alt="Cash"
                className="w-10 h-10 object-contain"
                loading="lazy"
              />
              <div>
                <div className="text-lg text-gray-900">
                  Cash on delivery
                </div>
                <div className="text-sm text-gray-500 mt-1 w-60">
                  Pay in cash when your car is delivered to your location
                </div>
              </div>
            </div>
            <span
              className={`inline-block w-6 h-6 rounded-full border items-center justify-center relative ${
                paymentMethod === "cash" ? "border-[#E6911E]" : "border-gray-300"
              }`}
            >
              {paymentMethod === "cash" && (
                <span className="w-3 h-3 bg-[#E6911E] rounded-full block absolute top-[5px] right-[5px]"></span>
              )}
            </span>
          </div>
          <div
            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition rounded-lg ${
              paymentMethod === "visa"
                ? "border-[#E6911E] ring-2 ring-[#E6911E] border"
                : "border-gray-200 border"
            }`}
            onClick={() => setPaymentMethod("visa")}
          >
            <div className="flex items-center gap-4">
              <img
                src={visaIcon}
                alt="Visa"
                className="w-10 h-10 object-contain"
                loading="lazy"
              />
              <div>
                <div className="text-lg text-gray-900">
                  Credit Card or Debit Card
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Pay with your credit or debit card
                </div>
              </div>
            </div>
            <span
              className={`inline-block w-6 h-6 rounded-full border items-center justify-center relative ${
                paymentMethod === "visa" ? "border-[#E6911E]" : "border-gray-300"
              }`}
            >
              {paymentMethod === "visa" && (
                <span className="w-3 h-3 bg-[#E6911E] rounded-full block absolute top-[5px] right-[5px]"></span>
              )}
            </span>
          </div>
        </div>

        {paymentMethod === "visa" && (
          <div className="flex flex-col gap-4 mb-6">
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={cardDetails.cardNumber}
              onChange={handleInputChange}
              className="border border-[#cdcac5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            />
            <div className="flex gap-4">
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={handleInputChange}
                className="border border-[#cdcac5] rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                className="border border-[#cdcac5] rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
              />
            </div>
            <input
              type="text"
              name="cardHolderName"
              placeholder="Card Holder Name"
              value={cardDetails.cardHolderName}
              onChange={handleInputChange}
              className="border border-[#cdcac5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E6911E]"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="flex items-center gap-2 mt-3">
            <input
              type="checkbox"
              checked={saveInfo}
              onChange={() => setSaveInfo(!saveInfo)}
              className="accent-[#E6911E]"
            />
            <span className="text-sm text-gray-600">
              Securely Save my Information For 1-click Checkout
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E6911E] hover:bg-[#E6911E] font-semibold py-2 rounded-lg text-white text-lg transition flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Pay $${parseFloat(booking.final_price).toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;