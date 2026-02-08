import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../utils/leafletFix";

const BangladeshMap = ({ locations }) => {
  return (
    <MapContainer
      center={[23.685, 90.3563]}
      zoom={7}
      style={{ height: "450px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((item, index) => (
        <Marker
          key={index}
          position={[item.latitude, item.longitude]}
        >
          <Popup>
            <strong>{item.district}</strong>
            <br />
            Region: {item.region}
            <br />
            City: {item.city}
            <br />
            Areas:
            <ul style={{ paddingLeft: "18px" }}>
              {item.covered_area.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
            <a
              href={item.flowchart}
              target="_blank"
              rel="noreferrer"
            >
              View flowchart
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default BangladeshMap;
