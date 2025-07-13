import React from "react";
import BookingStepper from "../components/ui/BookingStepper";
import PaymentForm from "../components/ui/PaymentForm";
import CarBookingSummary from "../components/ui/CarBookingSummary";
import Frame225 from "../assets/Car Details Card Icon/Frame 225.png";
import Group from "../assets/Car Details Card Icon/Group.png";
import Vector6 from "../assets/Car Details Card Icon/Vector (6).png";
import Frame290 from "../assets/Car Details Card Icon/Frame 290.png";
const Payment: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-2 sm:px-4 pt-24">
        <BookingStepper currentStep={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 m-auto">
          <div className="w-full flex flex-col items-end">
            <div className="w-full max-w-md">
              <PaymentForm />
            </div>
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-md">
              <CarBookingSummary
                transmissionIcon={Frame290}
                seatsIcon={Group}
                priceIcon={Vector6}
                engineIcon={Frame225}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
