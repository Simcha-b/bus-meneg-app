import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

export default function AddNewContact({ onSave }) {
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Call the onSave function passed as a prop with the new contact data
    onSave(contactData);
  };

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: "8px" // reduced from 16px
    }}>
      <TextField
        size="small"
        label="שם"
        name="name"
        value={contactData.name}
        onChange={handleChange}
        required
      />
      <TextField
        size="small"
        label="אימייל"
        name="email"
        value={contactData.email}
        onChange={handleChange}
        required
      />
      <TextField
        size="small"
        label="טלפון"
        name="phone"
        value={contactData.phone}
        onChange={handleChange}
        required
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSave}
        size="small"
        sx={{ alignSelf: 'flex-start', mt: 1 }}
      >
        שמור איש קשר
      </Button>
    </Box>
  );
}