import React from "react";

interface BookingStepperProps {
  currentStep: 1 | 2 | 3;
  className?: string;
}

const steps = [
  { label: "Your Selection", icon: "🔍" },
  { label: "Your Details", icon: "📝" },
  { label: "Confirmation", icon: "✅" },
];

const BookingStepper: React.FC<BookingStepperProps> = ({ 
  currentStep,
  className = "" 
}) => {
  return (
    <div className={`w-full ${className}`}>
      <h2 className="text-2xl font-bold text-center mb-4">
        <span className="text-[#E6911E]">P</span>ayment Process
      </h2>
      
      <div className="flex md:flex-row items-center justify-between w-full gap-4 md:gap-0 relative">
        <div>
          <div 
            className="h-full bg-[#E6911E] transition-all duration-500 ease-in-out"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
            }}
          />
        </div>

        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          const isLastStep = idx === steps.length - 1;

          return (
            <React.Fragment key={step.label}>
              <div className="flex flex-col gap-2 items-center w-full md:w-auto relative z-10">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 border-2 ${
                    isActive
                      ? "bg-[#E6911E] border-[#E6911E] text-white scale-110 shadow-lg"
                      : isCompleted
                      ? "bg-[#E6911E] border-[#E6911E] text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <span className="text-white">✓</span>
                  ) : (
                    <span>{step.icon}</span>
                  )}
                </div>
                
                <div className="flex flex-col items-center">
                  <span
                    className={`font-medium text-sm md:text-base ${
                      isActive || isCompleted
                        ? "text-[#E6911E] font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
              {!isLastStep && (
                <div
                  className={`flex-1 h-0.5 mx-2 hidden md:block ${
                    isCompleted || isActive
                      ? "bg-[#E6911E]"
                      : "bg-gray-200"
                  }`}
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