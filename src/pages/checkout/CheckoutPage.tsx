import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '@/context/CheckoutContext';
import { cartItems } from '@/data';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';
import CheckoutStep1 from '@/components/checkout/CheckoutStep1';
import CheckoutStep2 from '@/components/checkout/CheckoutStep2';
import CheckoutStep3 from '@/components/checkout/CheckoutStep3';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentStep, nextStep, previousStep, updateCheckoutData } = useCheckout();

  useEffect(() => {
    // Load cart items into checkout data
    updateCheckoutData({ items: cartItems });

    // Redirect to cart if cart is empty
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [navigate, updateCheckoutData]);

  const handleNext = () => {
    nextStep();
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/cart');
    } else {
      previousStep();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <CheckoutStepper currentStep={currentStep} />

        {currentStep === 1 && <CheckoutStep1 onNext={handleNext} onBack={handleBack} />}
        {currentStep === 2 && <CheckoutStep2 onNext={handleNext} onBack={handleBack} />}
        {currentStep === 3 && <CheckoutStep3 onBack={handleBack} />}
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;

