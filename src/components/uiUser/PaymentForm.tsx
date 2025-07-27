import React, { useState } from "react";
import { API_KEY } from "../../context/api/Api";
import cashIcon from "../../assets/PaymentForm/ion_cash (1).png";
import visaIcon from "../../assets/PaymentForm/Vector (7).png";

const PaymobButton = () => {
  const apiKey = API_KEY
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const savePaymentMethod = async ({
  bookingId,
  modelId,
  payment_method,
  transaction_id,
}: {
  bookingId: number;
  modelId: number;
  payment_method: string;
  transaction_id: string | null;
}) => {
  try {
    const res = await fetch(
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
    console.log("✅ Payment method saved:", result);

    if (result?.data?.status === "awaiting_payment") {
      alert("✅ تم تسجيل طريقة الدفع بنجاح");
    }
  } catch (err) {
    console.error("❌ Error saving payment method:", err);
    alert("⚠️ فشل في حفظ بيانات الدفع");
  }
};
    const handleCashPayment = () => {
    savePaymentMethod({
      bookingId: 1, 
      modelId: 1,
      payment_method: "cash",
      transaction_id: null,
    });
  };
  const handleOpenPaymob = async () => {
    if (!apiKey) {
      alert("Invalid API Key");
      return;
    }

    try {
      const response = await fetch("https://accept.paymob.com/api/auth/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey }),
      });

      const data = await response.json();
      const token = data.token;
      console.log("Auth token:", token);

      const orderResponse = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: token,
          delivery_needed: false,
          amount_cents: "10000",
          currency: "EGP",
          items: [],
        }),
      });

      const orderData = await orderResponse.json();
      console.log("Order ID:", orderData.id);

      const paymentKeyResponse = await fetch(
        "https://accept.paymob.com/api/acceptance/payment_keys",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auth_token: token,
            amount_cents: "10000",
            expiration: 3600,
            order_id: orderData.id,
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
          }),
        }
      );

      const paymentKeyData = await paymentKeyResponse.json();
      console.log("Payment token:", paymentKeyData.token);

      const iframe = `https://accept.paymob.com/api/acceptance/iframes/943449?payment_token=${paymentKeyData.token}`;
      setIframeUrl(iframe);
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">اختر وسيلة الدفع</h1>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <button
            onClick={handleCashPayment}
            className="bg-[#E6911E] hover:bg-[#e6911eb3] text-white px-6 py-2 rounded-lg shadow flex justify-center items-center gap-10"
          >
            <img src={cashIcon} alt="Cash" className="w-8 h-8 mb-2" />
            Pay with Cash
          </button>
          <button
            onClick={handleOpenPaymob}
            className="bg-[#E6911E] hover:bg-[#e6911eb3] text-white px-6 py-2 rounded-lg shadow flex justify-center items-center gap-10"
          >
            <img src={visaIcon} alt="Visa" className="w-8 h-8 mb-2" />
            Pay with Visa
          </button>
      </div>
      {iframeUrl && (
        <div className="-mt-[160px]">
          <iframe
            src={iframeUrl}
            title="Paymob Payment"
            width="100%"
            height="850px"
            style={{ border: "none" }}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default PaymobButton;
