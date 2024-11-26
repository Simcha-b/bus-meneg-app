import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { getCustomers } from "../../services/customersService";
import { getContactsByCustomerId } from "../../services/contactService";
import AddNewCustomer from "../customers/AddNewCustomer";
import AddNewContact from "../customers/AddNewContact";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
} from "@mui/material";

export default function CustomerContactSelector({
  setFormData,
  formData,
  errors,
}) {
  const [value, setValue] = useState("old");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactValue, setContactValue] = useState("old");

  // שליפת לקוחות
  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  // שליפת אנשי קשר של המוסד שנבחר
  const { data: contacts, isLoading: isLoadingContacts } = useQuery({
    queryKey: ["contacts", selectedCustomer?.customer_id],
    queryFn: () => getContactsByCustomerId(selectedCustomer?.customer_id),
    enabled: !!selectedCustomer?.customer_id,
  });

  // Update customer selection when formData changes
  useEffect(() => {
    if (formData.customer_id && customers && !selectedCustomer) {
      const customer = customers.find(
        (cust) => cust.customer_id === formData.customer_id
      );
      if (customer) {
        setSelectedCustomer(customer);
        setValue("old"); // Ensure we're in "old customer" mode
      }
    }
  }, [formData.customer_id, customers, selectedCustomer]);

  // Update contact selection when contacts are loaded
  useEffect(() => {
    if (formData.contact_id && contacts && !selectedContact) {
      const contact = contacts.find(
        (cont) => cont.id === formData.contact_id
      );
      if (contact) {
        setSelectedContact(contact);
        setContactValue("old"); // Ensure we're in "old contact" mode
      }
    }
  }, [formData.contact_id, contacts, selectedContact]);

  useEffect(() => {
    if (selectedCustomer) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        customer_id: selectedCustomer.customer_id,
      }));
    }
  }, [selectedCustomer, setFormData]);

  useEffect(() => {
    if (selectedContact) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        contact_id: selectedContact.id,
      }));
    }
  }, [selectedContact, setFormData]);

  const customerOptions = customers || [];
  const contactOptions = contacts || [];

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: 1, // reduced from 2
      width: '100%'
    }}>
      <FormControl>
        <RadioGroup
          row
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={{ mb: 1 }} // Added small margin bottom
        >
          <FormControlLabel 
            value="old" 
            control={<Radio size="small" />} 
            label="לקוח קיים"
            sx={{ mr: 1 }} // Reduced margin
          />
          <FormControlLabel 
            value="new" 
            control={<Radio size="small" />} 
            label="לקוח חדש"
          />
        </RadioGroup>
      </FormControl>

      {value === "new" ? (
        <Box sx={{ maxWidth: '600px' }}>
          <AddNewCustomer />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Autocomplete
            size="small" // Make the field smaller
            disablePortal
            options={customerOptions}
            getOptionLabel={(option) => option.name}
            loading={isLoadingCustomers}
            value={selectedCustomer}
            onChange={(event, newValue) => {
              setSelectedCustomer(newValue);
              setSelectedContact(null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="בחר מוסד"
                error={!!errors.customer_id}
                helperText={errors.customer_id}
              />
            )}
          />

          {selectedCustomer && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControl>
                <RadioGroup
                  row
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  sx={{ mb: 1 }}
                >
                  <FormControlLabel 
                    value="old" 
                    control={<Radio size="small" />} 
                    label="איש קשר קיים"
                    sx={{ mr: 1 }}
                  />
                  <FormControlLabel 
                    value="new" 
                    control={<Radio size="small" />} 
                    label="איש קשר חדש"
                  />
                </RadioGroup>
              </FormControl>

              {contactValue === "old" ? (
                <Autocomplete
                  size="small" // Make the field smaller
                  disablePortal
                  options={contactOptions}
                  getOptionLabel={(option) => option.name}
                  loading={isLoadingContacts}
                  value={selectedContact}
                  onChange={(event, newValue) => setSelectedContact(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="בחר איש קשר"
                      error={!!errors.contact_id}
                      helperText={errors.contact_id}
                    />
                  )}
                />
              ) : (
                <Box sx={{ maxWidth: '600px' }}>
                  <AddNewContact />
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
