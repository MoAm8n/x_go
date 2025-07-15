import React from "react";

interface BookingStepperProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { label: "Your Selection" },
  { label: "Your Details" },
  { label: "Confirmation" },
];

const BookingStepper: React.FC<BookingStepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full ">
      <h2 className="text-2xl font-bold text-center my-6">
        <span className="text-[#E6911E]">P</span>ayment
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-0">
        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          return (
            <React.Fragment key={step.label}>
              <div className="flex flex-row md:flex-col items-center md:items-start w-full md:w-auto">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors duration-200 border-2 ${
                    isActive
                      ? "bg-[#E6911E] border-[#E6911E] text-white"
                      : isCompleted
                      ? "bg-[#E6911E] border-[#E6911E] text-white"
                      : "bg-white border-gray-500 text-gray-500"
                  }`}
                >
                  {stepNumber}
                </div>
                <span
                  className={`ml-2 md:ml-0 md:mt-2 font-medium text-sm text-center ${
                    isActive
                      ? "text-[#E6911E]"
                      : isCompleted
                      ? "text-[#E6911E]"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className="md:flex-1 md:h-0.5 md:bg-gray-300 md:mx-2 min-w-[40px] hidden md:block"
                />
              )}
              {idx < steps.length - 1 && (
                <div
                  className="h-8 w-0.5 bg-gray-300 my-2 mx-auto md:hidden"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default BookingStepper;
