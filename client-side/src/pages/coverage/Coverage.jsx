import React, { useState } from "react";
import BangladeshMap from "./BangladeshMap";
import coverageData from "../../../public/warehouses.json";

const Coverage = () => {
  const [search, setSearch] = useState("");

  const filteredLocations = coverageData.filter((item) =>
    item.district.toLowerCase().includes(search.toLowerCase()) ||
    item.region.toLowerCase().includes(search.toLowerCase()) ||
    item.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 16px" }}>
      
      {/* Title */}
      <h1 style={{ textAlign: "center", fontSize: "28px", fontWeight: "bold" }}>
        We are available on{" "}
        <span style={{ color: "#0d6efd" }}>
          {coverageData.length} districts
        </span>
      </h1>

      {/* Search */}
      <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Search district / region / city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "340px",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Map */}
      <BangladeshMap locations={filteredLocations} />
    </div>
  );
};

export default Coverage;
