import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/he"; // Import Hebrew locale

export default function BasicDatePicker({ formData, setFormData }) {
  function handleDateChange(newDate) {

    newDate = new Date(newDate);

    const formattedDate = dayjs(newDate).format("YYYY-MM-DD");

    setFormData({ ...formData, order_date: formattedDate });
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
      <DatePicker
        label="תאריך ההזמנה"
        value={formData.order_date ? dayjs(formData.order_date) : null}
        onChange={(newValue) => {
          handleDateChange(newValue);
        }}
      />
    </LocalizationProvider>
  );
}
