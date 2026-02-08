import React from "react";
import servicesData from "./servicesData";

const Services = () => {
  return (
    <section className="bg-base-100 py-16">
      <div className="w-11/12 lg:w-9/12 mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-500">
            Enjoy fast, reliable parcel delivery with real-time tracking and
            zero hassle. From personal packages to business shipments — we
            deliver on time, every time.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="card bg-base-200 shadow-sm hover:shadow-lg transition rounded-2xl"
              >
                <div className="card-body">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="text-primary text-2xl" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm">{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
