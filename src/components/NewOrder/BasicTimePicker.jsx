import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";

import dayjs from "dayjs";

export default function BasicTimePicker({
  label,
  formData,
  setFormData,
  keyTable,
  initialTime, // new prop
}) {
  function handleTimeChange(newTime) {
    const formattedTime = dayjs(newTime).format("HH:mm");
    setFormData({ ...formData, [keyTable]: formattedTime });
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileTimePicker
        onChange={(newValue) => handleTimeChange(newValue)}
        label={label}
        value={formData[keyTable] ? dayjs(formData[keyTable], "HH:mm") : (initialTime ? dayjs(initialTime, "HH:mm") : null)} // set initial value if provided
      />
    </LocalizationProvider>
  );
}
