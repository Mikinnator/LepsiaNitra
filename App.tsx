import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ onSelect }: { onSelect: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function App() {
  const [reportFormVisible, setReportFormVisible] = useState(false);
  const [pins, setPins] = useState<{ position: [number, number]; title: string }[]>([]);

  const [newPin, setNewPin] = useState<{ position: [number, number]; title: string } | null>(null);

  const handleMapClick = (pos: [number, number]) => {
    setNewPin({ position: pos, title: "" });
    setReportFormVisible(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin && newPin.title) {
      setPins([...pins, newPin]);
      setNewPin(null);
      setReportFormVisible(false);
    }
  };

  return (
    <div className="w-screen h-screen">
      <MapContainer center={[48.3061, 18.0764]} zoom={15} className="w-full h-full z-0">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker onSelect={handleMapClick} />
        {pins.map((pin, i) => (
          <Marker key={i} position={pin.position} icon={defaultIcon} />
        ))}
        {newPin && <Marker position={newPin.position} icon={defaultIcon} />}
      </MapContainer>

      <div className="absolute top-4 left-4 z-10">
        <Button onClick={() => setReportFormVisible(true)}>Nahlásiť výtlk</Button>
      </div>

      {reportFormVisible && newPin && (
        <div className="absolute top-20 left-4 bg-white shadow-md rounded p-4 z-10 w-72">
          <h2 className="text-lg font-bold mb-2">Nový výtlk</h2>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Krátky popis"
              className="w-full border p-2 mb-2 rounded"
              value={newPin.title}
              onChange={(e) => setNewPin({ ...newPin, title: e.target.value })}
              required
            />
            <Button type="submit" className="w-full">Odoslať</Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
