import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import EditOrderModal from '../Orders/EditOrderModal';

function EditOrder({ order, fetchOrders, refreshOrders }) {
  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (fetchOrders) {
      fetchOrders();
    }
    if (refreshOrders) {
      refreshOrders();
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        icon={<EditOutlined />}
        size="small"
      />
      <EditOrderModal 
        open={open} 
        onClose={handleClose}
        orderId={order.order_id}
      />
    </>
  );
}

export default EditOrder;
