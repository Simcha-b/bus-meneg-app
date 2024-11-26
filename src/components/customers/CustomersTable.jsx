import React, { useEffect, useState } from "react";
import { getCustomers } from "../../services/customersService";
import {
  Button,
  ConfigProvider,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  List,
  Space,
} from "antd";
import heIL from "antd/lib/locale/he_IL";
import AddNewCustomer from "./AddNewCustomer";
import { getOrdersByCustomerId } from "../../services/ordersService";
import OrderDetails from "./OrderDetails";
import { Box } from "@mui/system";
import EditOrder from "../order-actions/EditOrder";
import DeleteOrder from "../order-actions/DeleteOrder";

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [form] = Form.useForm();

  //function to fetch customers from the server
  const fetchCustomers = async () => {
    try {
      const customers = await getCustomers();
      const customersWithStatus = await Promise.all(
        customers.map(async (customer) => {
          const orders = await getOrdersByCustomerId(customer.customer_id);
          
          if (orders.length === 0) {
            return {
              ...customer,
              payment_status: null,
              totalDebt: 0
            };
          }

          let totalDebt = 0;
          const hasUnpaidOrders = orders.some((order) => {
            if (!order.paid) {
              // מכפיל את המחיר לאוטובוס במספר האוטובוסים
              totalDebt += order.price_per_bus_customer * order.bus_quantity;
              return true;
            }
            return false;
          });

          return {
            ...customer,
            payment_status: hasUnpaidOrders ? "חוב פתוח" : "שולם",
            totalDebt: totalDebt
          };
        })
      );
      setCustomers(customersWithStatus);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  //function to handle the show orders button
  const handleShowOrders = async (record) => {
    const res = await getOrdersByCustomerId(record.customer_id);
    setOrders(res);
    setSelectedCustomerName(record.name);
    setOpen(true);
  };
  //function to handle the close button
  const handleClose = () => {
    setOpen(false);
  };
  //function to handle the order click
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };
  //function to handle the close order details
  const handleOrderDetailsClose = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  //function to handle the edit customer
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    form.setFieldsValue(customer);
    setContacts(customer.contacts || []);
    setIsCustomerModalOpen(true);
  };

  //function to handle the save customer
  const handleSaveCustomer = () => {
    form.validateFields().then((values) => {
      // Implement save logic here, e.g., call an API to save the edited customer
      setIsCustomerModalOpen(false);
      setSelectedCustomer(null);
    });
  };

  //function to handle the close customer modal
  const handleCustomerModalClose = () => {
    setIsCustomerModalOpen(false);
    setSelectedCustomer(null);
  };

  //function to handle adding a new contact
  const handleAddContact = () => {
    setContacts([...contacts, newContact]);
    setNewContact({ name: "", phone: "" });
  };

  //function to handle removing a contact
  const handleRemoveContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  //columns for the main table
  const columns = [
    {
      title: "שם",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "אימייל",
      dataIndex: "email",
      key: "email",
      width: "15%",
    },
    {
      title: "טלפון",
      dataIndex: "phone",
      key: "phone",
      width: "10%",
    },
    {
      title: "פעולות",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleShowOrders(record)}
          key={`action-${record.key}`}
        >
          הצג פירוט נסיעות
        </Button>
      ),
      width: "20%",
    },
    {
      title: "סטטוס",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        if (!record.payment_status) return null;
        return (
          <Tag color={record.payment_status === "חוב פתוח" ? "red" : "green"}>
            {record.payment_status}
          </Tag>
        );
      },
    },
    {
      title: "מצב תשלומים",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (_, record) => {
        if (!record.payment_status) return "אין נסיעות";
        if (record.payment_status === "חוב פתוח") {
          return record.totalDebt === 0 ? (
            "נתוני תשלום חסרים"
          ) : (
            <span style={{ color: 'red' }}>
              {`-${record.totalDebt} ₪`}
            </span>
          );
        }
        return "שולם";
      },
    },
    {
      title: "ערוך פרטים",
      key: "edit",
      render: (_, record) => (
        <Button onClick={() => handleEditCustomer(record)}>
          ערוך פרטי לקוח
        </Button>
      ),
    },
  ];
  //columns for the orders table
  const ordersColumns = [
    {
      title: "ID",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "תאריך",
      dataIndex: "order_date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString("he-IL"),
    },
    {
      title: "פרטי הנסיעה",
      dataIndex: "trip_details",
      key: "trip_details",
    },
    {
      title: "מחיר לאוטובוס",
      dataIndex: "price_per_bus_customer",
      key: "price",
    },
    {
      title: "כמות אוטובוסים",
      dataIndex: "bus_quantity",
      key: "quantity",
    },
    {
      title: "סה״כ לתשלום",
      key: "total",
      render: (_, record) => `${record.price_per_bus_customer * record.bus_quantity} ₪`,
    },
    {
      title: "מצב הזמנה",
      dataIndex: "paid",
      key: "paid",
      render: (paid) => (paid ? "שולם" : "לא שולם"),
    },
    {
      title: "פעולות",
      key: "actions",
      render: (_, record) => (
        <Space>
          <EditOrder order={record} />
          <DeleteOrder order_id={record.order_id} fetchOrders={() => handleShowOrders({ customer_id: record.customer_id })} />
        </Space>
      ),
    },
  ];

  const handleDeleteOrder = (order) => {
    // Implement delete logic here, e.g., call an API to delete the order
    console.log("Deleting order:", order);
  };

  return (
    <ConfigProvider direction="rtl" locale={heIL}>
      <Box>
        <Box mb={2}>
          <AddNewCustomer customers={customers} setCustomers={setCustomers} />
        </Box>
        <Table
          dataSource={customers.map((customer, index) => ({
            ...customer,
            key: index,
          }))}
          expandable={{}}
          columns={columns}
          bordered={true}
        />
        <Modal
          title={`פירוט נסיעות - ${selectedCustomerName}`}
          open={open}
          onCancel={handleClose}
          footer={[
            <Button key="close" onClick={handleClose}>
              סגור
            </Button>,
          ]}
          width="90%"
        >
          <Table
            dataSource={orders}
            columns={ordersColumns}
            pagination={false}
            onRow={(record) => ({
              onClick: () => handleOrderClick(record),
              style: { cursor: "pointer" },
            })}
          />
        </Modal>
        <Modal
          title="פרטי נסיעה"
          open={showOrderDetails}
          onCancel={handleOrderDetailsClose}
          footer={[
            <Button key="close" onClick={handleOrderDetailsClose}>
              סגור
            </Button>,
          ]}
          width="80%"
        >
          {selectedOrder && <OrderDetails order={selectedOrder} />}
        </Modal>
        <Modal
          title="ערוך פרטי לקוח"
          open={isCustomerModalOpen}
          onCancel={handleCustomerModalClose}
          onOk={handleSaveCustomer}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="שם"
              rules={[{ required: true, message: "נא להזין שם" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="אימייל"
              rules={[{ required: true, message: "נא להזין אימייל" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="טלפון"
              rules={[{ required: true, message: "נא להזין טלפון" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="אנשי קשר">
              <List
                dataSource={contacts}
                renderItem={(contact, index) => (
                  <List.Item
                    actions={[
                      <Button onClick={() => handleRemoveContact(index)}>
                        מחק
                      </Button>,
                    ]}
                  >
                    {contact.name} - {contact.phone}
                  </List.Item>
                )}
              />
              <Space>
                <Input
                  placeholder="שם"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                />
                <Input
                  placeholder="טלפון"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({ ...newContact, phone: e.target.value })
                  }
                />
                <Button onClick={handleAddContact}>הוסף איש קשר</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Box>
    </ConfigProvider>
  );
};

export default CustomersTable;
