import { useState, useEffect } from "react";
import axios from "axios";
import { t } from "i18next";
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
        toast.error(t("payment_form.must_be_logged_in"));
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
      toast.success(t("payment_form.payment_recorded_success"));
      onPaymentSuccess();
    } catch (error: any) {
      toast.error(t("payment_form.error_recording_payment"));
      console.error(t("payment_form.save_payment_error"), error.response?.data || error.message);
    }
  };

  // Handle messages from Paymob iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://accept.paymob.com") return;

      const data = event.data;
      console.log(t("payment_form.message_from_paymob"), data);

      if (data?.event === "payment_success" || data?.success === true) {
        savePaymentMethod("visa", data.transaction?.id || null);
        setIframeUrl(null);
        setActiveMethod(null);
      } else if (data?.event === "payment_failed") {
        toast.error(t("payment_form.payment_failed"));
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
        toast.error(t("payment_form.missing_api_key"));
        setIsLoading(false);
        setActiveMethod(null);
        return;
      }

      // Step 1: Get auth token
      const authRes = await axios.post("https://accept.paymob.com/api/auth/tokens", {
        api_key: apiKey,
      });
      const authToken = authRes.data.token;
      if (!authToken) throw new Error(t("payment_form.failed_auth_token"));

      // Step 2: Create order
      const orderRes = await axios.post("https://accept.paymob.com/api/ecommerce/orders", {
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: Math.round(Number(booking.final_price) * 100),
        currency: "EGP",
        items: [],
      });
      const orderId = orderRes.data.id;
      if (!orderId) throw new Error(t("payment_form.failed_create_order"));

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
          first_name: t("payment_form.test_user"),
          street: t("payment_form.test_street"),
          building: "NA",
          phone_number: "+201000000000",
          shipping_method: "NA",
          postal_code: "NA",
          city: t("payment_form.cairo"),
          country: "EG",
          last_name: t("payment_form.user"),
          state: t("payment_form.cairo"),
        },
        currency: "EGP",
        integration_id: integrationId,
      });

      const paymentToken = paymentKeyRes.data.token;
      if (!paymentToken) throw new Error(t("payment_form.failed_payment_token"));

      const iframe = `https://accept.paymob.com/api/acceptance/iframes/943449?payment_token=${paymentToken}`;
      setIframeUrl(iframe);
    } catch (error: any) {
      toast.error(t("payment_form.error_preparing_payment"));
      console.error(t("payment_form.card_payment_error"), error.response?.data || error.message);
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
    <div className="max-w-xl mx-auto p-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-center">{t("payment_form.select_payment_method")}</h1>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <button
          onClick={handleCashPayment}
          disabled={isLoading && activeMethod !== "cash"}
          className={`bg-[#E6911E] text-white px-6 py-2 rounded-lg shadow flex justify-center items-center gap-10 transition-all
            ${isLoading && activeMethod !== "cash" ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e6911eb3]"}`}
        >
          <img src={cashIcon} alt={t("payment_form.cash")} className="w-8 h-8" />
          {isLoading && activeMethod === "cash" ? t("payment_form.paying_cash") : t("payment_form.pay_cash")}
        </button>

        <button
          onClick={handleCardPayment}
          disabled={isLoading && activeMethod !== "card"}
          className={`bg-[#E6911E] text-white px-6 py-2 rounded-lg shadow flex justify-center items-center gap-10 transition-all
            ${isLoading && activeMethod !== "card" ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e6911eb3]"}`}
        >
          <img src={visaIcon} alt={t("payment_form.card")} className="w-8 h-8" />
          {isLoading && activeMethod === "card" ? t("payment_form.paying_card") : t("payment_form.pay_card")}
        </button>
      </div>

      {iframeUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative">
            <button
              onClick={handleCloseIframe}
              className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 z-10"
              aria-label={t("payment_form.close_payment")}
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
              title={t("payment_form.secure_payment_gateway")}
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