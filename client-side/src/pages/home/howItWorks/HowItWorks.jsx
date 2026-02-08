import React from "react";
import {
  FaBoxOpen,
  FaMoneyBillWave,
  FaWarehouse,
  FaBuilding,
} from "react-icons/fa";

const steps = [
  {
    title: "Booking Pick & Drop",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
    icon: <FaBoxOpen size={28} />,
  },
  {
    title: "Cash On Delivery",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
    icon: <FaMoneyBillWave size={28} />,
  },
  {
    title: "Delivery Hub",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
    icon: <FaWarehouse size={28} />,
  },
  {
    title: "Booking SME & Corporate",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
    icon: <FaBuilding size={28} />,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-base-100">
      <div className="w-11/12 mx-auto">
        {/* Section Header */}
        <h2 className="text-3xl font-bold mb-10 text-left">How it works</h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="card bg-base-200 shadow-sm">
              <div className="card-body flex flex-col items-start gap-4">
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-content">
                  {step.icon}
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-semibold mb-1">{step.title}</h3>
                  <p className="text-base-content/70">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
