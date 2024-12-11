import React from "react";
import { Card, Descriptions } from "antd";
import EditOrder from "../order-actions/EditOrder";

const OrderDetails = ({ order, fetchOrders }) => {
  return (
    <Card>
      <Descriptions bordered column={2} dir="rtl">
        <Descriptions.Item label="שם לקוח">{order.customer_name}</Descriptions.Item>
        <Descriptions.Item label="איש קשר">{order.contact_name}</Descriptions.Item>
        <Descriptions.Item label="שעת התחלה">{order.start_time}</Descriptions.Item>
        <Descriptions.Item label="שעת סיום">{order.end_time}</Descriptions.Item>
        <Descriptions.Item label="חברת הסעות">{order.company_name || 'לא שובץ'}</Descriptions.Item>
        <Descriptions.Item label="כמות אוטובוסים">{order.bus_quantity}</Descriptions.Item>
        
        <Descriptions.Item label="פרטי הנסיעה" span={2}>{order.trip_details}</Descriptions.Item>

        {/* מידע כספי - לקוח */}
        <Descriptions.Item label="מחיר לאוטובוס">₪{order.price_per_bus_customer}</Descriptions.Item>
        <Descriptions.Item label="תשלומים נוספים">₪{order.extra_pay_customer}</Descriptions.Item>
        <Descriptions.Item label="סה''כ לתשלום">₪{Number(order.price_per_bus_customer)*Number(order.bus_quantity)+Number(order.extra_pay_customer)}</Descriptions.Item>
        <Descriptions.Item label="מספר חשבונית">{order.invoice}</Descriptions.Item>
        <Descriptions.Item label='סה"כ שולם'>₪{order.total_paid_customer}</Descriptions.Item>
        <Descriptions.Item label="סטטוס תשלום">{order.paid ? "שולם" : "לא שולם"}</Descriptions.Item>

        {/* מידע כספי - ספק */}
        <Descriptions.Item label="מחיר ספק לאוטובוס">₪{order.price_per_bus_company}</Descriptions.Item>
        <Descriptions.Item label="מחיר ספק">₪{Number(order.price_per_bus_company)*Number(order.bus_quantity)}</Descriptions.Item>
        <Descriptions.Item label="תשלומים נוספים לספק">₪{order.extra_pay_company}</Descriptions.Item>
        <Descriptions.Item label="סה''כ לתשלום לספק">₪{Number(order.price_per_bus_company)*Number(order.bus_quantity)+Number(order.extra_pay_company)}</Descriptions.Item>
        <Descriptions.Item label="הגיש חשבונית">{order.submitted_invoice ? "כן" : "לא"}</Descriptions.Item>

        {/* הערות */}
        <Descriptions.Item label="הערות ללקוח" span={2}>{order.notes_customer}</Descriptions.Item>
        <Descriptions.Item label="הערות לספק" span={2}>{order.notes_company}</Descriptions.Item>
      </Descriptions>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginTop: '16px' 
      }}>
        <EditOrder order={order} fetchOrders={fetchOrders} />
      </div>
    </Card>
  );
};

export default OrderDetails;
