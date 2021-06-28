import React, { useContext, useState } from "react";
import DisplayContext from "../../context/display-context";
import StoreContext from "../../context/store-context";
import * as styles from "../../styles/CheckoutStepContainer.module.css";
import CheckoutSummery from "./checkout-summery";
import InformationStep from "./information-step";
import PaymentStep from "./payment-step";
import ShippingStep from "./shipping-step";
import StepOverview from "./step-overview";

const CheckoutStep = () => {
  const {
    checkoutStep,
    orderSummery,
    updateCheckoutStep,
    updateOrderSummeryDisplay,
  } = useContext(DisplayContext);
  const { cart, updateAddress, setShippingMethod } = useContext(StoreContext);

  const [isProcessingInfo, setIsProcessingInfo] = useState(false);
  const [isProcessingShipping, setIsProcessingShipping] = useState(false);

  const handleShippingSubmit = async (address, email) => {
    setIsProcessingInfo(true);

    const country = cart.region.countries.find(
      (c) => c.display_name === address.country_code
    );

    updateAddress({ ...address, country_code: country.iso_2 }, email);

    setIsProcessingInfo(false);
    updateCheckoutStep(2);
  };

  const handleDeliverySubmit = async (option) => {
    setIsProcessingShipping(true);
    setShippingMethod(option.id);
    setIsProcessingShipping(false);
    updateCheckoutStep(3);
  };

  const handleStep = () => {
    switch (checkoutStep) {
      case 1:
        return (
          <InformationStep
            isProcessing={isProcessingInfo}
            savedValues={{
              ...cart.shipping_address,
              email: cart.email,
              country: cart.region?.countries.find(
                (country) =>
                  country.iso_2 === cart.shipping_address?.country_code
              )?.display_name,
            }}
            handleSubmit={(submittedAddr, submittedEmail) =>
              handleShippingSubmit(submittedAddr, submittedEmail)
            }
          />
        );
      case 2:
        return (
          <ShippingStep
            isProcessing={isProcessingShipping}
            cart={cart}
            handleDeliverySubmit={handleDeliverySubmit}
            savedMethods={cart.shipping_methods}
          />
        );
      case 3:
        return <PaymentStep />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.steps}>
        <div className={styles.breadcrumbs}>
          <p className={checkoutStep === 1 ? styles.activeStep : ""}>
            Information
          </p>
          <p>/</p>
          <p className={checkoutStep === 2 ? styles.activeStep : ""}>
            Delivery
          </p>
          <p>/</p>
          <p className={checkoutStep === 3 ? styles.activeStep : ""}>Payment</p>
        </div>
        {checkoutStep !== 1 ? <StepOverview /> : null}
        {handleStep()}
        <button
          className={styles.orderBtn}
          onClick={() => updateOrderSummeryDisplay()}
        >
          View Order Summery
        </button>
      </div>
      <div className={`${styles.summery} ${orderSummery ? styles.active : ""}`}>
        <CheckoutSummery cart={cart} />
      </div>
    </div>
  );
};

export default CheckoutStep;
