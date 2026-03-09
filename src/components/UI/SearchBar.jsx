

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";
import { useMap } from "react-leaflet";

const SearchBar = ({ onLocationSelect }) => {
  const map = useMap();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Suggestion search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim().length > 2) {
        setLoading(true);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=10&addressdetails=1`
          );

          const data = await res.json();

          setResults(data);
          setShowDropdown(true);
        } catch (err) {
          console.error("Geocoding failed:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Manual search when Enter pressed
  const handleManualSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
      );

      const data = await res.json();

      if (data.length > 0) {
        const item = data[0];

        const coords = {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          name: item.display_name.split(",")[0],
          fullAddress: item.display_name,
        };

        map.flyTo([coords.lat, coords.lng], 16, {
          animate: true,
          duration: 1.5,
        });

        setQuery(coords.name);
        setShowDropdown(false);

        if (onLocationSelect) {
          onLocationSelect(coords);
        }
      }
    } catch (err) {
      console.error("Manual search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Suggestion click
  const handleSelect = (item) => {
    const coords = {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      name: item.address?.name || item.display_name.split(",")[0],
      fullAddress: item.display_name,
    };

    map.flyTo([coords.lat, coords.lng], 16, {
      animate: true,
      duration: 1.5,
    });

    setQuery(coords.name);
    setShowDropdown(false);

    if (onLocationSelect) {
      onLocationSelect(coords);
    }
  };

  return (
    <div
      ref={searchRef}
      className="absolute top-6 left-6 z-[1002] w-[calc(100%-48px)] max-w-[420px]"
    >
      {/* INPUT */}
      <div
        className={`bg-[var(--bg-card)] shadow-[var(--shadow-card)] border border-[var(--border)] 
        transition-all flex items-center px-5 py-4
        ${
          showDropdown && results.length > 0
            ? "rounded-t-2xl border-b-transparent"
            : "rounded-2xl"
        }
        focus-within:border-[var(--color-primary)]`}
      >
        {loading ? (
          <Loader2
            className="text-[var(--color-primary)] mr-3 animate-spin"
            size={20}
          />
        ) : (
          <Search
            className="text-[var(--text-secondary)] mr-3 cursor-pointer"
            size={20}
            onClick={handleManualSearch}
          />
        )}

        <input
          type="text"
          placeholder="Search for a destination..."
          className="flex-1 bg-transparent outline-none text-[var(--text-primary)] font-medium placeholder:text-[var(--text-light)] text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setShowDropdown(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleManualSearch();
            }
          }}
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setShowDropdown(false);
            }}
            className="text-[var(--text-light)] cursor-pointer hover:text-[var(--color-primary)]"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* RESULTS */}
      {showDropdown && results.length > 0 && (
        <div className="bg-[var(--bg-card)] border-x border-b border-[var(--border)] rounded-b-2xl shadow-[var(--shadow-hover)] overflow-hidden">
          {results.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSelect(item)}
              className="w-full flex items-start gap-4 px-5 py-4 hover:bg-[var(--bg-soft)] transition-colors text-left border-t border-[var(--border)] first:border-none"
            >
              <div className="mt-1 bg-[var(--bg-soft)] p-2 rounded-full text-[var(--color-primary)]">
                <MapPin size={16} />
              </div>

              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-[var(--text-primary)] truncate">
                  {item.address?.name || item.display_name.split(",")[0]}
                </span>

                <span className="text-[11px] text-[var(--text-secondary)] truncate opacity-80">
                  {item.display_name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;




