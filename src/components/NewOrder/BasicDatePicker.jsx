import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/he";

export default function BasicDatePicker({ formData, setFormData }) {
  const parseDateFromServer = (dateString) => {
    if (!dateString) return null;
    // Convert from DD.MM.YYYY to YYYY-MM-DD format
    const [day, month, year] = dateString.split('.');
    return dayjs(`${year}-${month}-${day}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
      <DatePicker
        label="תאריך ההזמנה"
        value={parseDateFromServer(formData.order_date)}
        onChange={(newValue) => {
          setFormData({
            ...formData,
            order_date: newValue ? newValue.format("YYYY-MM-DD") : null
          });
        }}
      />
    </LocalizationProvider>
  );
}
