import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { addNewCustomer } from "../../services/customersService";

export default function AddNewCustomer({ customers, setCustomers, onSuccess }) {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    contacts: [{ name: "", contact_phone: "", contact_email: "" }],
  });
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      contacts: [{ name: "", phone: "", email: "" }],
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value,
    });
  };
  const handleContactChange = (index, field, value) => {
    const newContacts = [...customer.contacts];
    newContacts[index] = {
      ...newContacts[index],
      [field]: value,
    };
    setCustomer({
      ...customer,
      contacts: newContacts,
    });
  };

  const addContactField = () => {
    setCustomer({
      ...customer,
      contacts: [...customer.contacts, { name: "", phone: "", email: "" }],
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await addNewCustomer(customer);
      // Format the customer object correctly before passing it to onSuccess
      const formattedCustomer = {
        customer_id: response.insertId, // Use the insertId from the response
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      };
      
      if (response) {
        if (setCustomers) {
          setCustomers(prev => [...prev, formattedCustomer]);
        }
        setShowSuccess(true);
        if (onSuccess) {
          onSuccess(formattedCustomer);
        }
        handleClose();
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      setError("אירעה שגיאה בהוספת הלקוח");
      setShowError(true);
    }
  };

  return (
    <>
      <IconButton
        color="primary"
        sx={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "primary.main",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
        onClick={() => setOpen(true)}
      >
        <AddIcon sx={{ color: "white" }} />
      </IconButton>
      {/* <Button
        variant="contained"
        sx={{
          gridColumn: "1/-1",
          justifySelf: "start",
          maxWidth: "180px",
          minWidth: "140px",
          height: "36px",
        }}
        onClick={() => setOpen(true)}
      >
        הוסף לקוח חדש
      </Button> */}

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ backgroundColor: "primary.main", color: "white" }}>
          הוסף לקוח חדש
        </DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="שם"
            type="text"
            fullWidth
            variant="standard"
            value={customer.name}
            onChange={handleChange}
            sx={{ marginBottom: "12px" }}
          />
          <TextField
            margin="dense"
            name="email"
            label="אימייל"
            type="email"
            fullWidth
            variant="standard"
            value={customer.email}
            onChange={handleChange}
            sx={{ marginBottom: "12px" }}
          />
          <TextField
            margin="dense"
            name="phone"
            label="טלפון"
            type="text"
            fullWidth
            variant="standard"
            value={customer.phone}
            onChange={handleChange}
            sx={{ marginBottom: "12px" }}
          />
          <TextField
            margin="dense"
            name="address"
            label="כתובת"
            type="text"
            fullWidth
            variant="standard"
            value={customer.address}
            onChange={handleChange}
            sx={{ marginBottom: "12px" }}
          />
          {customer.contacts.map((contact, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "12px",
              }}
            >
              <Box sx={{ marginBottom: "8px" }}>איש קשר {index + 1}</Box>
              <TextField
                margin="dense"
                label={`שם איש קשר ${index + 1}`}
                type="text"
                fullWidth
                variant="outlined"
                value={contact.name}
                onChange={(e) =>
                  handleContactChange(index, "name", e.target.value)
                }
                sx={{ marginBottom: "8px" }}
              />
              <TextField
                variant="outlined"
                margin="dense"
                label={`טלפון איש קשר ${index + 1}`}
                type="text"
                fullWidth
                value={contact.phone}
                onChange={(e) =>
                  handleContactChange(index, "phone", e.target.value)
                }
                sx={{ marginBottom: "8px" }}
              />
              <TextField
                variant="outlined"
                margin="dense"
                label={`אימייל איש קשר ${index + 1}`}
                type="email"
                fullWidth
                value={contact.email}
                onChange={(e) =>
                  handleContactChange(index, "email", e.target.value)
                }
              />
            </Box>
          ))}
          <IconButton onClick={addContactField} sx={{ marginTop: "12px" }}>
            <AddCircleOutlineIcon color="primary" />
          </IconButton>
        </DialogContent>
        <DialogActions sx={{ padding: "12px" }}>
          <Button onClick={handleClose} sx={{ color: "primary.main" }}>
            ביטול
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: "primary.main", color: "white" }}
          >
            הוסף
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          הלקוח נוסף בהצלחה!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setShowError(false)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
