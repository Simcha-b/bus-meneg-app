import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";

const WETHER_API_KEY = process.env.REACT_APP_WETHER_API_KEY;
function Wether() {
  const [wether, setWether] = useState({});
  const [error, setError] = useState(null);

  const fetchWether = async () => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WETHER_API_KEY}&q=Beit-Shemesh&aqi=no`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("שגיאה בבקשת הנתונים");
      }
      const data = await response.json();
      setWether(data);
    } catch (error) {
      console.error("שגיאה בקריאת הדיווחים:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchWether();
  }, []);

  return (
    <div>
      {error ? (
        <div>שגיאה: {error}</div>
      ) : (
        <div>
          {wether.current && (
            <div>
              <Box sx={{ display: "flex", gap: 2 }}>
                <p>{wether.location.name}</p>
                <p style={{font:"icon"}}>{wether.current.temp_c}°C</p>
                <img src={wether.current.condition.icon} alt="weather icon" />
              </Box>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Wether;
