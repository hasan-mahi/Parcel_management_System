import React from "react";
import tracking from "../../../assets/benefit/Illustration.png";
import delivery from "../../../assets/benefit/Group 4.png";
import call from "../../../assets/benefit/Group 4.png";

const benefits = [
  {
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    img: tracking,
  },
  {
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    img: delivery,
  },
  {
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    img: call,
  },
];

const Benefit = () => {
  return (
    <section className="py-16 bg-base-100">
      <div className="w-11/12 lg:w-8/12 mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Our Benefits</h1>
          <p className="text-gray-500">
            Why customers trust us for fast, safe, and reliable delivery
          </p>
        </div>

        {/* Benefit Cards */}
        <div className="space-y-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="card bg-base-200 shadow-md p-5">
              <div className="card-body flex flex-row items-start gap-6">
                {/* Image */}
                <div>
                  <img
                    src={benefit.img}
                    alt={benefit.title}
                    className="w-50 object-contain"
                  />
                </div>

                {/* Dashed Line */}
                <div className="divider divider-horizontal divider-neutral"></div>

                {/* Content */}
                <div>
                  <h2 className="card-title text-xl mb-2">{benefit.title}</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefit;
