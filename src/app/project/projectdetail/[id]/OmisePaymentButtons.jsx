import React, { useState } from "react";
import Script from "react-load-script";
import { useTranslation } from "react-i18next";
import { MdDescription } from "react-icons/md";

export default function CheckoutInternetBanking({ projectName, price, createInternetBankingCharge }) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { t, i18n } = useTranslation("translation");
  const handleScriptLoad = () => {
    window.OmiseCard.configure({
      publicKey: "pkey_test_60p92rfxgib6kr9v4gp",
      frameLabel: "Digitech Space",
      submitLabel: "Pay Now",
      currency: "thb",
      locale: "en",
    });
    setIsScriptLoaded(true);
  };

  const internetBankingConfigure = () => {
    window.OmiseCard.configure({
      defaultPaymentMethod: "promptpay",
      otherPaymentMethods: [
        "internet_banking",
        "mobile_banking_bay",
        "mobile_banking_bbl",
        "mobile_banking_ktb",
        "mobile_banking_kbank",
        "mobile_banking_scb",
      ],
    });
    window.OmiseCard.configureButton("#internet-banking");
    window.OmiseCard.attach();
  };

  const Credit_Card_Configure = () => {
    window.OmiseCard.configure({
      defaultPaymentMethod: "credit_card",
    });
    window.OmiseCard.configureButton("#credit_card");
    window.OmiseCard.attach();
  };

  const omiseCardHandler = (type) => {
    window.OmiseCard.open({
      amount: price * 100,
      description: projectName,
      onCreateTokenSuccess: (token) => {
        createInternetBankingCharge(price, token, type);
      },
      onFormClosed: () => {},
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    internetBankingConfigure();
    omiseCardHandler("other");
  };

  const handleClick2 = (e) => {
    e.preventDefault();
    Credit_Card_Configure();
    omiseCardHandler("credit_card");
  };

  return (
    <div className="own-form">
      <Script
        url="https://cdn.omise.co/omise.js"
        onLoad={handleScriptLoad}
        async
      />
      {isScriptLoaded && (
        <form className="flex flex-col sm:flex-col md:flex-row items-center space-y-5 md:space-y-0 md:space-x-5 mt-4">
          <button
            id="credit_card"
            className="btn credit_card flex-grow flex justify-center rounded-md bg-[#33539B] px-3 py-3 w-full text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:w-1/2"
            type="button"
            onClick={handleClick2}
          >
            <span>{t("nav.project.projectdetail.paymentde")}</span>
          </button>
          <button
            id="internet-banking"
            className="btn internet-banking flex-grow flex justify-center rounded-md bg-[#33539B] px-3 py-3 w-full text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:w-1/2"
            type="button"
            onClick={handleClick}
          >
            <span>{t("nav.project.projectdetail.paymentmobile")}</span>
          </button>
        </form>
      )}
    </div>
  );
}
