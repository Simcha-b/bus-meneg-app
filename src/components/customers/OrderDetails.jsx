import React from "react";
import { Card, Descriptions } from "antd";
import { Box } from '@mui/system';
import { formatDate } from "../../services/ordersService";

const OrderDetails = ({ order, fetchOrders }) => {
  return (
    <Box sx={{
      p: { xs: 0.5, sm: 1, md: 2 },
      maxWidth: '100%',
      overflowX: 'auto'
    }}>
      <Card>
        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2, lg: 3 }}
          size={window.innerWidth <= 768 ? "small" : "default"}
          labelStyle={{ 
            fontWeight: 'bold',
            backgroundColor: '#fafafa',
            width: window.innerWidth <= 768 ? '100px' : '150px',
            padding: window.innerWidth <= 768 ? '4px 8px' : '8px 16px'
          }}
          contentStyle={{
            padding: window.innerWidth <= 768 ? '4px 8px' : '8px 16px'
          }}
        >
          {/* פרטי הזמנה בסיסיים */}
          <Descriptions.Item label="מספר הזמנה">{order.order_id}</Descriptions.Item>
          <Descriptions.Item label="תאריך נסיעה">{formatDate(order.order_date)}</Descriptions.Item>
          <Descriptions.Item label="סטטוס">{order.status || 'פעיל'}</Descriptions.Item>

          {/* זמני נסיעה */}
          <Descriptions.Item label="שעת איסוף">{order.start_time?.slice(0, 5)}</Descriptions.Item>
          <Descriptions.Item label="שעת סיום">{order.end_time?.slice(0, 5)}</Descriptions.Item>
          <Descriptions.Item label="כמות אוטובוסים">{order.bus_quantity}</Descriptions.Item>

          {/* פרטי לקוח */}
          <Descriptions.Item label="שם לקוח">{order.customer_name}</Descriptions.Item>
          <Descriptions.Item label="איש קשר">{order.contact_name}</Descriptions.Item>
          <Descriptions.Item label="טלפון">{order.contact_phone}</Descriptions.Item>

          {/* מיקומים */}
          <Descriptions.Item label="פרטי הנסיעה">{order.trip_details}</Descriptions.Item>
          <Descriptions.Item label="חברה מבצעת">{order.company_name || 'לא שובץ'}</Descriptions.Item>

          {/* פרטי תשלום */}
          <Descriptions.Item label="מחיר לאוטובוס">₪{order.price_per_bus_customer || 0}</Descriptions.Item>
          <Descriptions.Item label="סה״כ מחיר">₪{(order.price_per_bus_customer * order.bus_quantity) || 0}</Descriptions.Item>
          <Descriptions.Item label="סה״כ שולם">₪{order.total_paid_customer || 0}</Descriptions.Item>

          {/* פרטי חברה מבצעת */}
          {order.company_id && (
            <>
              <Descriptions.Item label="מחיר לחברה">₪{order.price_per_bus_company || 0}</Descriptions.Item>
              <Descriptions.Item label="סה״כ לתשלום">₪{(order.price_per_bus_company * order.bus_quantity) || 0}</Descriptions.Item>
              <Descriptions.Item label="שולם לחברה">₪{order.total_paid_company || 0}</Descriptions.Item>
            </>
          )}

          {/* הערות */}
          {order.notes && (
            <Descriptions.Item label="הערות" span={3}>
              {order.notes}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </Box>
  );
};

export default OrderDetails;
