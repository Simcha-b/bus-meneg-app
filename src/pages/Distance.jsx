import { Button, Box, Stack, Alert, Autocomplete, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
const API_URL = process.env.REACT_APP_API_URL;

function Distance() {
  const [distance, setDistance] = useState("");
  const [locations, setLocations] = useState(["", ""]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://data.gov.il/api/3/action/datastore_search?resource_id=d4901968-dad3-4845-a9b0-a57d027f11ab&limit=1500"
        );
        const data = await response.json();
        if (data.success && data.result.records) {
          // Extract unique city names and trim whitespace
          const cityNames = [...new Set(
            data.result.records
              .map(record => record.שם_ישוב.trim())
              .filter(name => name) // Remove empty strings
          )];
          setCities(cityNames.sort());
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError("שגיאה בטעינת רשימת הערים");
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, []);

  const addLocationField = () => {
    // Insert new empty location before the last element (destination)
    const newLocations = [
      ...locations.slice(0, -1), // כל הנקודות חוץ מהיעד
      "", // נקודה חדשה
      locations[locations.length - 1], // היעד
    ];
    setLocations(newLocations);
  };

  const handleLocationChange = (index, newValue) => {
    const newLocations = [...locations];
    newLocations[index] = newValue || "";
    setLocations(newLocations);
  };

  const removeLocationField = (index) => {
    if (locations.length > 2) {
      // Never remove first (start) or last (destination) points
      if (index === 0 || index === locations.length - 1) return;
      const newLocations = locations.filter((_, i) => i !== index);
      setLocations(newLocations);
    }
  };

  const handleSubmit = async () => {
    const validLocations = locations.filter((loc) => loc.trim() !== "");
    if (validLocations.length < 2) {
      setError("נא להזין לפחות שתי נקודות ציון");
      return;
    }
    setLoading(true);
    setDistance(""); // Clear previous results
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/orders/calculate-distance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify({
          locations: validLocations.map((loc) => loc.trim()),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "שגיאה בתקשורת עם השרת");
      }

      if (!Array.isArray(data) || !data.length) {
        throw new Error("לא נמצאו תוצאות עבור הכתובות שהוזנו");
      }

      if (!data[0].totalDistanceInKm) {
        throw new Error("לא ניתן לחשב את המרחק בין הנקודות שהוזנו");
      }

      setDistance(`המרחק הכולל הוא ${data[0].totalDistanceInKm} ק"מ`);
    } catch (error) {
      console.error("שגיאה בחישוב המרחק:", error);
      setError(error.message || "שגיאה בחישוב המרחק");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          font: "menu",
          fontSize: "large",
        }}
      >
        חישוב מרחק נסיעה
      </h2>
      <Stack spacing={3}>
        {locations.map((loc, index) => (
          <Box
            key={index}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
          >
            <Autocomplete
              fullWidth
              freeSolo
              options={cities}
              loading={citiesLoading}
              value={loc}
              onChange={(event, newValue) => handleLocationChange(index, newValue)}
              onInputChange={(event, newValue) => {
                if (event) {
                  handleLocationChange(index, newValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={
                    index === 0
                      ? "נקודת התחלה"
                      : index === locations.length - 1
                      ? "יעד"
                      : `נקודת ביניים ${index}`
                  }
                />
              )}
            />
            {locations.length > 2 &&
              index !== 0 &&
              index !== locations.length - 1 && (
                <Button
                  onClick={() => removeLocationField(index)}
                  variant="outlined"
                  color="error"
                  sx={{ minWidth: "auto" }}
                >
                  X
                </Button>
              )}
          </Box>
        ))}

        <Button
          onClick={addLocationField}
          variant="outlined"
          sx={{ alignSelf: "flex-start" }}
        >
          הוסף נקודת ביניים +
        </Button>

        {error && (
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        )}

        {distance && !error && (
          <Box
            sx={{
              p: 2,
              bgcolor: "#e3f2fd",
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            {distance}
          </Box>
        )}

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ minWidth: "120px" }}
            disabled={loading} // Disable button when loading
          >
            {loading ? "טוען..." : "חשב מרחק"}
          </Button>
          <Button
            onClick={() => {
              setLocations(["", ""]);
              setDistance("");
            }}
            variant="outlined"
            sx={{ minWidth: "120px" }}
          >
            איפוס
          </Button>
        </Stack>
      </Stack>{" "}
    </Box>
  );
}

export default Distance;
