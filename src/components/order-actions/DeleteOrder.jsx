import React from "react";
import { Button } from 'antd';

import { deleteOrder } from "../../services/ordersService";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function DeleteOrder({ order_id, fetchOrders }) {
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    console.log(111);
    try {
      const res = await deleteOrder(order_id);
      if (res) {
        fetchOrders();
        return res;
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
    handleClose();
    setConfirmDelete(false);
  };

  return (
    <div>
      <Button
        size="small"
        onClick={handleClickOpen}
        icon={<DeleteIcon />}
      ></Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"האם אתה בטוח שברצונך למחוק את ההזמנה?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            לא תוכל לשחזר את הפעולה
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ביטול </Button>
          <Button
            onClick={() => {
              setConfirmDelete(true);
              handleDelete();
            }}
            autoFocus
          >
            אני רוצה למחוק
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DeleteOrder;
