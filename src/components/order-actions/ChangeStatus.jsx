
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
} from "@mui/material";
import { updateOrderStatus } from "../../services/ordersService";

const ChangeStatus = ({ order_id, fetchOrders }) => {
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleStatusChange = async () => {
    console.log("newStatus", status);
    const response = await updateOrderStatus(order_id, status);
    if (!response) {
      console.log("Failed to update status");
    }
    fetchOrders();
    handleClose();
  };

  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        שנה סטטוס{" "}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>עדכן סטטוס</DialogTitle>
        <DialogContent>
          <DialogContentText>בחר סטטוס</DialogContentText>
          <Select value={status} onChange={handleChange} fullWidth>
            <MenuItem value="בביצוע">חסרים פרטים</MenuItem>
            <MenuItem value="בתהליך">לביצוע</MenuItem>
            <MenuItem value="חסר שיבוץ">חסר שיבוץ</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleStatusChange} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChangeStatus;
