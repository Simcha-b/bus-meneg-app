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
  Card,
  Row,
  Col,
  Tabs,
  Avatar
} from "antd";
import heIL from "antd/lib/locale/he_IL";
import AddNewCustomer from "./AddNewCustomer";
import { getOrdersByCustomerId } from "../../services/ordersService";
import OrderDetails from "./OrderDetails";
import { Box } from "@mui/system";
import EditOrder from "../order-actions/EditOrder";
import DeleteOrder from "../order-actions/DeleteOrder";
import { EyeOutlined, EditOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

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
  const [searchText, setSearchText] = useState('');

  //function to fetch customers from the server
  const fetchCustomers = async () => {
    try {
      const customers = await getCustomers();
      const customersWithStatus = await Promise.all(
        customers.map(async (customer) => {
          const orders = await getOrdersByCustomerId(customer.customer_id);
          
          let totalDebt = 0;
          const hasUnpaidOrders = orders.some((order) => {
            if (!order.paid) {
              totalDebt += order.price_per_bus_customer * order.bus_quantity;
              return true;
            }
            return false;
          });

          return {
            ...customer,
            payment_status: hasUnpaidOrders && totalDebt > 0 ? "חוב פתוח" : null,
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

  // פונקציה לרענון ההזמנות של לקוח ספציפי
  const refreshOrders = async (customerId) => {
    const updatedOrders = await getOrdersByCustomerId(customerId);
    // setOrders(updatedOrders);
  };

  //columns for the main table
  // const columns = [
  //   {
  //     title: "שם",
  //     dataIndex: "name",
  //     key: "name",
  //     width: "10%",
  //     sorter: (a, b) => a.name.localeCompare(b.name),
  //     filterSearch: true,
  //     filters: [...new Set(customers.map(customer => customer.name))]
  //       .map(name => ({ text: name, value: name })),
  //     onFilter: (value, record) => record.name === value,
  //   },
  //   {
  //     title: "אימייל",
  //     dataIndex: "email",
  //     key: "email",
  //     width: "15%",
  //     filterSearch: true,
  //     filters: [...new Set(customers.map(customer => customer.email))]
  //       .map(email => ({ text: email, value: email })),
  //     onFilter: (value, record) => record.email === value,
  //   },
  //   {
  //     title: "טלפון",
  //     dataIndex: "phone",
  //     key: "phone",
  //     width: "10%",
  //     filterSearch: true,
  //     filters: [...new Set(customers.map(customer => customer.phone))]
  //       .map(phone => ({ text: phone, value: phone })),
  //     onFilter: (value, record) => record.phone === value,
  //   },
  //   {
  //     title: "פעולות",
  //     key: "action",
  //     render: (_, record) => (
  //       <Button
  //         onClick={() => handleShowOrders(record)}
  //         key={`action-${record.key}`}
  //       >
  //         הצג פירוט נסיעות
  //       </Button>
  //     ),
  //     width: "15%",
  //   },
  //   {
  //     title: "סטטוס",
  //     dataIndex: "status",
  //     key: "status",
  //     render: (_, record) => {
  //       if (!record.payment_status) return null;
  //       return (
  //         <Tag color={record.payment_status === "חוב פתוח" ? "red" : "green"}>
  //           {record.payment_status}
  //         </Tag>
  //       );
  //     },
  //     filters: [
  //       { text: "חוב פתוח", value: "חוב פתוח" },
  //       { text: "שולם", value: "שולם" },
  //       { text: "אין נסיעות", value: null }
  //     ],
  //     onFilter: (value, record) => record.payment_status === value,
  //   },
  //   {
  //     title: "מצב תשלומים",
  //     dataIndex: "payment_status",
  //     key: "payment_status",
  //     render: (_, record) => {
  //       if (!record.payment_status) return "אין נסיעות";
  //       if (record.payment_status === "חוב פתוח") {
  //         return record.totalDebt === 0 ? (
  //           "נתוני תשלום חסרים"
  //         ) : (
  //           <span style={{ color: 'red' }}>
  //             {`-${record.totalDebt} ₪`}
  //           </span>
  //         );
  //       }
  //       return "שולם";
  //     },
  //     sorter: (a, b) => (a.totalDebt || 0) - (b.totalDebt || 0),
  //   },
  //   {
  //     title: "ערוך פרטים",
  //     key: "edit",
  //     render: (_, record) => (
  //       <Button 
  //         icon={<EditOutlined />}
  //         onClick={() => handleEditCustomer(record)}
  //         title="ערוך פרטי לקוח"
  //       />
  //     ),
  //   },
  // ];
  //columns for the orders table
  const ordersColumns = [
    {
      title: "תאריך",
      dataIndex: "order_date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString("he-IL"),
      sorter: (a, b) => new Date(a.order_date) - new Date(b.order_date),
      filterSearch: true,
      filters: [...new Set(orders.map(order => 
        new Date(order.order_date).toLocaleDateString("he-IL")))
      ].map(date => ({ text: date, value: date })),
      onFilter: (value, record) => 
        new Date(record.order_date).toLocaleDateString("he-IL") === value,
    },
    {
      title: "פרטי הנסיעה",
      dataIndex: "trip_details",
      key: "trip_details",
      filterSearch: true,
      filters: [...new Set(orders.map(order => order.trip_details))]
        .map(detail => ({ text: detail, value: detail })),
      onFilter: (value, record) => record.trip_details === value,
    },
    {
      title: "מחיר לאוטובוס",
      dataIndex: "price_per_bus_customer",
      key: "price",
      sorter: (a, b) => a.price_per_bus_customer - b.price_per_bus_customer,
    },
    {
      title: "כמות אוטובוסים",
      dataIndex: "bus_quantity",
      key: "quantity",
      sorter: (a, b) => a.bus_quantity - b.bus_quantity,
    },
    {
      title: "סה״כ לתשלום",
      key: "total",
      render: (_, record) => `${record.price_per_bus_customer * record.bus_quantity} ₪`,
      sorter: (a, b) => 
        (a.price_per_bus_customer * a.bus_quantity) - 
        (b.price_per_bus_customer * b.bus_quantity),
    },
    {
      title: "מס' חשבונית",
      dataIndex: "invoice",
      key: "invoice",
      filterSearch: true,
      filters: [...new Set(orders.filter(order => order.invoice).map(order => order.invoice))]
        .map(invoice => ({ text: invoice, value: invoice })),
      onFilter: (value, record) => record.invoice === value,
    },
    {
      title: "מצב הזמנה",
      dataIndex: "paid",
      key: "paid",
      render: (paid) => (paid ? "שולם" : "לא שולם"),
      filters: [
        { text: "שולם", value: true },
        { text: "לא שולם", value: false },
      ],
      onFilter: (value, record) => record.paid === value,
    },
    {
      title: "פעולות",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => handleOrderClick(record)}
            title="צפה בפרטי נסיעה"
          />
          <EditOrder 
            order={record} 
            fetchOrders={() => handleShowOrders({ customer_id: record.customer_id })}
            refreshOrders={() => refreshOrders(record.customer_id)} 
          />
          <DeleteOrder 
            order_id={record.order_id} 
            fetchOrders={() => handleShowOrders({ customer_id: record.customer_id })} 
          />
        </Space>
      ),
    },
  ];

  const groupedCustomers = {
    all: customers,
    debt: customers.filter(c => c.payment_status === "חוב פתוח"),
  };

  const filteredCustomers = customers
    .filter(customer => 
      customer.name.includes(searchText) || 
      customer.phone.includes(searchText) || 
      customer.email.includes(searchText)
    )
    .sort((a, b) => a.name.localeCompare(b.name)); // מיון לפי שם

  return (
    <ConfigProvider direction="rtl" locale={heIL}>
      <Box>
        <Box mb={2} display="flex" gap={2} flexWrap="wrap">
          <AddNewCustomer customers={customers} setCustomers={setCustomers} />
          <Input.Search
            placeholder="חיפוש לקוח..."
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 300 }}
          />
        </Box>
        <Tabs defaultActiveKey="all">
          {Object.entries({
            all: { tab: "כל הלקוחות", data: filteredCustomers },
            debt: { tab: "בחוב", data: groupedCustomers.debt.filter(c => 
              c.name.includes(searchText) || 
              c.phone.includes(searchText) || 
              c.email.includes(searchText)
            )}
          }).map(([key, { tab, data }]) => (
            <Tabs.TabPane tab={tab} key={key}>
              <Row gutter={[16, 16]}>
                {data.map((customer, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4} key={customer.customer_id}>
                    <Card
                      hoverable
                      style={{ height: '100%' }}
                      actions={[
                        <EditOutlined key="edit" onClick={() => handleEditCustomer(customer)} />,
                        <EyeOutlined key="orders" onClick={() => handleShowOrders(customer)} />
                      ]}
                    >
                      <Card.Meta
                        avatar={<Avatar style={{ backgroundColor: customer.payment_status === "חוב פתוח" ? '#ff4d4f' : '#52c41a' }}>
                          {customer.name[0]}
                        </Avatar>}
                        title={<span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>{customer.name}</span>}
                        description={
                          <Space direction="vertical" size="small" style={{ width: '100%', marginTop: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <PhoneOutlined />
                              <span style={{ flex: 1 }}>{customer.phone}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <MailOutlined />
                              <span style={{ flex: 1 }}>{customer.email}</span>
                            </div>
                            {customer.payment_status === "חוב פתוח" && (
                              <Tag color="red" style={{ marginTop: 8 }}>
                                {`חוב: ${customer.totalDebt} ₪`}
                              </Tag>
                            )}
                          </Space>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tabs.TabPane>
          ))}
        </Tabs>
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
            scroll={{ x: true }}
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
