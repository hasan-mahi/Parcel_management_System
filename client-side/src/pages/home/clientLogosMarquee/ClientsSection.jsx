import React from "react";
import Marquee from "react-fast-marquee";
import client1 from "../../../assets/brands/amazon.png";
import client2 from "../../../assets/brands/amazon_vector.png";
import client3 from "../../../assets/brands/casio.png";
import client4 from "../../../assets/brands/moonstar.png";
import client5 from "../../../assets/brands/randstad.png";
import client6 from "../../../assets/brands/star.png";
import client7 from "../../../assets/brands/start_people.png";

const clients = [client1, client2, client3, client4, client5, client6, client7];

const ClientsSection = () => {
  return (
    <section className="bg-base-200 py-16">
      <div className="w-11/12 mx-auto">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          We've helped thousands of{" "}
          <span className="text-primary">sales teams</span>
        </h2>

        {/* Marquee */}
        <Marquee
          speed={60}
          gradient={true}
          gradientColor={[240, 240, 240]}
          pauseOnHover={true}
        >
          {clients.map((logo, index) => (
            <div key={index} className="mx-24">
              <img
                src={logo}
                alt="Client Logo"
                className="h-6 md:h-6 object-contain grayscale hover:grayscale-0 transition"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default ClientsSection;
