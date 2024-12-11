import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { insertContact } from "../../services/contactService";

export default function AddNewContact({ customer_id, onSuccess }) {
  const [contactData, setContactData] = useState({
    name: "",
    contact_phone: "",
    contact_email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (values) => {
    try {
      const newContact = await insertContact({ ...values, customer_id });
      onSuccess?.(newContact);
      // remove any reset/clear form logic if it exists
    } catch (error) {
      // ...existing error handling...
    }
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
        value={contactData.contact_email}
        onChange={handleChange}
      />
      <TextField
        size="small"
        label="טלפון"
        name="phone"
        value={contactData.contact_phone}
        onChange={handleChange}
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSubmit}
        size="small"
        sx={{ alignSelf: 'flex-start', mt: 1 }}
      >
        שמור איש קשר
      </Button>
    </Box>
  );
}