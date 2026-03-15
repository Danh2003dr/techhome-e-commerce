import React from 'react';

interface CheckoutStepperProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'Địa chỉ', icon: 'location_on' },
  { number: 2, label: 'Vận chuyển', icon: 'local_shipping' },
  { number: 3, label: 'Thanh toán', icon: 'payment' },
];

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-center gap-4 md:gap-8">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive
                      ? 'bg-primary border-primary text-white'
                      : isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <span className="material-icons text-xl">check</span>
                  ) : (
                    <span className="material-icons text-xl">{step.icon}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-semibold ${
                    isActive
                      ? 'text-primary'
                      : isCompleted
                        ? 'text-emerald-600'
                        : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`h-0.5 w-16 md:w-24 transition-all ${
                    isCompleted ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
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

export default CheckoutStepper;

