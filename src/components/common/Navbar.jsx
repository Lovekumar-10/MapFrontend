import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-card shadow-card px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2 font-semibold">
        <MapPin size={20} color="var(--color-primary)" />
        <span>Non Track It</span>
      </div>

      {/* Right Buttons */}
      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={() => navigate("/share")}
          className="text-secondary hover:text-primary"
        >
          Share
        </button>

        <button
          onClick={() => navigate("/track")}
          className="text-secondary hover:text-primary"
        >
          Track
        </button>
      </div>
    </nav>
  );
}

export default Navbar;