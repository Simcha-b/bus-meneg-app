import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import {
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import {
  getOrderById,
  sendNewOrder,
  updateOrder,
} from "../services/ordersService";
import { CompanySelector } from "../components/NewOrder/CompanySelector";
import { useNavigate } from "react-router-dom";
import BasicDatePicker from "../components/NewOrder/BasicDatePicker";
import CustomerContactSelector from "../components/NewOrder/CustomerContactSelector";
import BasicTimePicker from "../components/NewOrder/BasicTimePicker";

function NewOrder({ orderId, isModal, onClose }) {
  const navigate = useNavigate();
  const companyRef = useRef();

  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);

  const [priceCustomer, setPriceCustomer] = useState(0);
  const [totalPriceCustomer, setTotalPriceCustomer] = useState(0);
  const [totalPriceCompany, setTotalPriceCompany] = useState(0);

  const [formData, setFormData] = useState({
    customer_id: 0,
    contact_id: 0,
    company_id: 0,
    trip_details: "",
    start_time: null,
    end_time: null,
    bus_quantity: null,
    price_per_bus_customer: null,
    extra_pay_customer: null,
    notes_customer: "",
    paid: false,
    total_paid_customer: null,
    price_per_bus_company: null,
    notes_company: "",
    extra_pay_company: null,
    submitted_invoice: false,
    status: "חסר שיבוץ",
  });

  const [errors, setErrors] = useState({});

  //function to calculate the price
  const calculatePrice = () => {
    const priceCustomer =
      Number(formData.bus_quantity) * Number(formData.price_per_bus_customer);
    setPriceCustomer(priceCustomer);
    const totalPriceCustomer =
      priceCustomer + Number(formData.extra_pay_customer);
    setTotalPriceCustomer(totalPriceCustomer);
    const totalPriceCompany =
      Number(formData.bus_quantity) * Number(formData.price_per_bus_company) +
      Number(formData.extra_pay_company);
    setTotalPriceCompany(totalPriceCompany);
  };

  useEffect(() => {
    calculatePrice();
  }, [formData]);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const orderData = await getOrderById(orderId);
          setFormData(orderData);
        } catch (error) {
          console.error("Error fetching order:", error);
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleErrorClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorOpen(false);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value === "" ? "" : value,
    }));
  };
  const hendelchecked = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      paid: e.target.checked
    }));
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.trip_details) newErrors.trip_details = "פרטי הנסיעה נדרשים";
    if (!formData.customer_id) newErrors.customer_id = "לקוח נדרש";
    if (!formData.contact_id) newErrors.contact_id = "איש קשר נדרש";
    // if (!formData.start_time) newErrors.start_time = "שעת התחלה נדרשת";
    // if (!formData.end_time) newErrors.end_time = "שעת סיום נדרשת";
    if (!formData.bus_quantity) newErrors.bus_quantity = "כמות אוטובוסים נדרשת";
    if (!formData.order_date) newErrors.date = "תאריך נדרש";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setErrorMessage("אנא מלא את כל השדות הנדרשים");
      setErrorOpen(true);
    }
    return Object.keys(newErrors).length === 0;
  };
  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Format the date to YYYY-MM-DD before sending
      const formattedData = {
        ...formData,
        order_date: formData.order_date ? new Date(formData.order_date).toISOString().split('T')[0] : null
      };

      let response;
      if (orderId) {
        response = await updateOrder(orderId, formattedData);
        console.log("updateOrder" , response);
        
      } else {
        response = await sendNewOrder(formattedData);
        console.log("sendNewOrder");
        
      }

      if (response.success) {
        setOpen(true);
        if (isModal) {
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setTimeout(() => {
            navigate("/orders");
          }, 1500);
        }
      } else {
        setErrorMessage(response.message || (orderId ? "שגיאה בעדכון ההזמנה" : "שגיאה בשליחת ההזמנה"));
        setErrorOpen(true);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("שגיאת שרת");
      setErrorOpen(true);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 800, margin: "0 auto" }}>
      <Paper elevation={3} sx={{ p: 3, position: "relative" }}>
        {/* {isModal && (
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        )} */}
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Trip Details Section */}
          <Box sx={{ display: "grid", gap: 2 }}>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <BasicDatePicker setFormData={setFormData} formData={formData} />
              <TextField
                required
                fullWidth
                dir="rtl"
                id="bus_quantity"
                label="כמות אוטובוסים"
                type="number"
                variant="outlined"
                value={formData.bus_quantity || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0) handleInputChange(e);
                }}
                error={!!errors.bus_quantity}
                helperText={errors.bus_quantity}
                InputProps={{ notched: true }}
              />
            </Box>

            <CustomerContactSelector
              setFormData={setFormData}
              formData={formData}
              errors={errors}
            />

            <TextField
              required
              fullWidth
              dir="rtl"
              id="trip_details"
              label="פרטי הנסיעה"
              variant="outlined"
              value={formData.trip_details || ""}
              onChange={handleInputChange}
              error={!!errors.trip_details}
              helperText={errors.trip_details}
            />

            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <BasicTimePicker
                label="שעת התחלה"
                keyTable="start_time"
                formData={formData}
                setFormData={setFormData}
              />
              <BasicTimePicker
                label="שעת סיום"
                keyTable="end_time"
                formData={formData}
                setFormData={setFormData}
              />
            </Box>
          </Box>

          {/* Payment and Company Buttons */}
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Button
              variant="contained"
              onClick={() => setShowPaymentDetails(!showPaymentDetails)}
              size="small"
            >
              {showPaymentDetails ? "הסתר פרטי תשלום" : "הוסף פרטי תשלום"}
            </Button>
            <Button
              variant="contained"
              onClick={() => setShowCompanyDetails(!showCompanyDetails)}
              size="small"
            >
              {showCompanyDetails ? "הסתר פרטי ספק" : "הוסף פרטי ספק"}
            </Button>
          </Box>

          {/* Payment Details Section */}
          {showPaymentDetails && (
            <Paper elevation={1} sx={{ p: 2 }}>
              <Box
                sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}
              >
                <TextField
                  fullWidth
                  id="price_per_bus_customer"
                  label="מחיר לאוטובוס"
                  variant="outlined"
                  value={formData.price_per_bus_customer || ""}
                  onChange={handleInputChange}
                />
                <TextField
                  fullWidth
                  id="extra_pay_customer"
                  label="תשלומים נוספים"
                  variant="outlined"
                  value={formData.extra_pay_customer || ""}
                  onChange={handleInputChange}
                />

                <Typography sx={{ gridColumn: "span 2" }}>
                  {`מחיר ללקוח: ${priceCustomer} ש"ח | סכום כולל: ${totalPriceCustomer} ש"ח`}
                </Typography>

                <TextField
                  fullWidth
                  id="notes_customer"
                  label="הערות"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={formData.notes_customer || ""}
                  onChange={handleInputChange}
                  sx={{ gridColumn: "span 2" }}
                />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    gap: 2,
                    alignItems: "center",
                    gridColumn: "span 3",
                  }}
                >
                  <TextField
                    id="invoice"
                    label="מספר חשבונית"
                    variant="outlined"
                    value={formData.invoice || ""}
                    onChange={handleInputChange}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(formData.paid)}
                        onChange={hendelchecked}
                      />
                    }
                    id="paid"
                    label="שולם"
                  />
                  <TextField
                    id="total_paid_customer"
                    label="סה''כ שולם"
                    variant="outlined"
                    value={formData.total_paid_customer || ""}
                    onChange={handleInputChange}
                  />
                </Box>
              </Box>
            </Paper>
          )}

          {/* Company Details Section */}
          {showCompanyDetails && (
            <Paper elevation={1} sx={{ p: 2 }} ref={companyRef}>
              <Box
                sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}
              >
                <CompanySelector setFormData={setFormData} />
                <TextField
                  fullWidth
                  id="price_per_bus_company"
                  label="מחיר ספק לאוטובוס"
                  variant="outlined"
                  value={formData.price_per_bus_company || ""}
                  onChange={handleInputChange}
                />
                <TextField
                  fullWidth
                  id="extra_pay_company"
                  label="תשלומים נוספים"
                  variant="outlined"
                  value={formData.extra_pay_company || ""}
                  onChange={handleInputChange}
                />

                <Typography sx={{ gridColumn: "span 2" }}>
                  {`סכום כולל ספק: ${totalPriceCompany} ש"ח`}
                </Typography>

                <TextField
                  fullWidth
                  id="notes_company"
                  label="הערות ספק"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={formData.notes_company || ""}
                  onChange={handleInputChange}
                  sx={{ gridColumn: "span 2" }}
                />

                <FormControlLabel
                  control={<Checkbox />}
                  id="submitted_invoice"
                  label="הגיש חשבונית"
                  onChange={handleInputChange}
                />
              </Box>
            </Paper>
          )}

          {/* Submit Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{ width: "120px" }}
            >
              {orderId ? "עדכן" : "שלח"}
            </Button>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{ width: "120px", ml: 2 }}
            >
              ביטול
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        dir="rtl"
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {orderId ? "הזמנה עודכנה בהצלחה" : "הזמנה נוספה בהצלחה"}
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        dir="rtl"
      >
        <Alert
          onClose={handleErrorClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default NewOrder;
