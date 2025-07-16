import React from "react";
import BookingStepper from "../components/uiUser/BookingStepper";
import PaymentForm from "../components/uiUser/PaymentForm";
import CarBookingSummary from "../components/uiUser/CarBookingSummary";
const Payment: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto px-2 sm:px-4 max-md:py-8">
        <BookingStepper currentStep={3} />
        <div className="flex py-10">
            <div className="flex flex-col w-2/4">
              <PaymentForm />
          </div>
          <div className="w-2/4">
              <CarBookingSummary/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
