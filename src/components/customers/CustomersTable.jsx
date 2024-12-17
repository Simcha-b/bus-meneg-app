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
  Avatar,
  Tooltip,
  Spin,
} from "antd";
import heIL from "antd/lib/locale/he_IL";
import AddNewCustomer from "./AddNewCustomer";
import { getOrdersByCustomerId } from "../../services/ordersService";
import OrderDetails from "./OrderDetails";
import { Box } from "@mui/system";
import EditOrder from "../order-actions/EditOrder";
import DeleteOrder from "../order-actions/DeleteOrder";
import {
  EyeOutlined,
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import  ExportToExcel  from "../common/ExportToExcel";

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
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  //function to fetch customers from the server
  const fetchCustomers = async () => {
    try {
      setLoading(true);
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
            payment_status:
              hasUnpaidOrders && totalDebt > 0 ? "חוב פתוח" : null,
            totalDebt: totalDebt,
          };
        })
      );
      setCustomers(customersWithStatus);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
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
    // const updatedOrders = await getOrdersByCustomerId(customerId);
    // setOrders(updatedOrders);
  };

  // פונקציות להכנת הנתונים לייצוא
  const prepareOrdersForExport = () => {
    return orders.map(order => ({
      תאריך: new Date(order.order_date).toLocaleDateString("he-IL"),
      "פרטי נסיעה": order.trip_details,
      "מחיר לאוטובוס": order.price_per_bus_customer,
      "כמות אוטובוסים": order.bus_quantity,
      "סה״כ לתשלום": order.price_per_bus_customer * order.bus_quantity,
      "מס׳ חשבונית": order.invoice || "",
      "סטטוס תשלום": order.paid ? "שולם" : "לא שולם"
    }));
  };

  const prepareDebtsForExport = () => {
    return customers
      .filter(c => c.payment_status === "חוב פתוח")
      .map(customer => ({
        "שם לקוח": customer.name,
        "טלפון": customer.phone,
        "אימייל": customer.email,
        "סכום חוב": customer.totalDebt,
      }));
  };

  // הוספת הגדרות עמודות לייצוא
  const ordersExportColumns = [
    { title: "תאריך", dataIndex: "תאריך" },
    { title: "פרטי נסיעה", dataIndex: "פרטי נסיעה" },
    { title: "מחיר לאוטובוס", dataIndex: "מחיר לאוטובוס" },
    { title: "כמות אוטובוסים", dataIndex: "כמות אוטובוסים" },
    { title: "סה״כ לתשלום", dataIndex: "סה״כ לתשלום" },
    { title: "מס׳ חשבונית", dataIndex: "מס׳ חשבונית" },
    { title: "סטטוס תשלום", dataIndex: "סטטוס תשלום" }
  ];

  const debtsExportColumns = [
    { title: "שם לקוח", dataIndex: "שם לקוח" },
    { title: "טלפון", dataIndex: "טלפון" },
    { title: "אימייל", dataIndex: "אימייל" },
    { title: "סכום חוב", dataIndex: "סכום חוב" }
  ];

  //columns for the orders table
  const ordersColumns = [
    {
      title: "תאריך",
      dataIndex: "order_date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString("he-IL"),
      sorter: (a, b) => new Date(a.order_date) - new Date(b.order_date),
      filterSearch: true,
      filters: [
        ...new Set(
          orders.map((order) =>
            new Date(order.order_date).toLocaleDateString("he-IL")
          )
        ),
      ].map((date) => ({ text: date, value: date })),
      onFilter: (value, record) =>
        new Date(record.order_date).toLocaleDateString("he-IL") === value,
    },
    {
      title: "פרטי הנסיעה",
      dataIndex: "trip_details",
      key: "trip_details",
      filterSearch: true,
      filters: [...new Set(orders.map((order) => order.trip_details))].map(
        (detail) => ({ text: detail, value: detail })
      ),
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
      render: (_, record) =>
        `${record.price_per_bus_customer * record.bus_quantity} ₪`,
      sorter: (a, b) =>
        a.price_per_bus_customer * a.bus_quantity -
        b.price_per_bus_customer * b.bus_quantity,
    },
    {
      title: "מס' חשבונית",
      dataIndex: "invoice",
      key: "invoice",
      filterSearch: true,
      filters: [
        ...new Set(
          orders.filter((order) => order.invoice).map((order) => order.invoice)
        ),
      ].map((invoice) => ({ text: invoice, value: invoice })),
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
            fetchOrders={() =>
              handleShowOrders({ customer_id: record.customer_id })
            }
            refreshOrders={() => refreshOrders(record.customer_id)}
          />
          <DeleteOrder
            order_id={record.order_id}
            fetchOrders={() =>
              handleShowOrders({ customer_id: record.customer_id })
            }
          />
        </Space>
      ),
    },
  ];

  const groupedCustomers = {
    all: customers,
    debt: customers.filter((c) => c.payment_status === "חוב פתוח"),
  };

  const filteredCustomers = customers
    .filter(
      (customer) =>
        customer.name.includes(searchText) ||
        customer.phone.includes(searchText) ||
        customer.email.includes(searchText)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ConfigProvider direction="rtl" locale={heIL}>
      <Spin spinning={loading} tip="טוען נתונים...">
      <AddNewCustomer customers={customers} setCustomers={setCustomers} />  
        <Box>
          <Box mb={2} display="flex" gap={2} flexWrap="wrap"justifyContent="center" >
            <Input.Search
              placeholder="חיפוש לקוח..."
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 300 }}
            />
          </Box>
          <Tabs defaultActiveKey="all">
            {Object.entries({
              all: { tab: "כל הלקוחות", data: filteredCustomers },
              debt: {
                tab: "בחוב",
                data: groupedCustomers.debt.filter(
                  (c) =>
                    c.name.includes(searchText) ||
                    c.phone.includes(searchText) ||
                    c.email.includes(searchText)
                ),
              },
            }).map(([key, { tab, data }]) => (
              <Tabs.TabPane tab={tab} key={key}>
                <Row gutter={[16, 16]}>
                  {data.map((customer, index) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={8}
                      lg={6}
                      xl={4}
                      key={customer.customer_id}
                    >
                      <Card
                        hoverable
                        style={{ height: "100%" }}
                        actions={[
                          <Tooltip title=" ערוך פרטי לקוח">
                            <EditOutlined
                              key="edit"
                              onClick={() => handleEditCustomer(customer)}
                            />
                          </Tooltip>,
                          <Tooltip title="הצג פירוט נסיעות">
                            <EyeOutlined
                              key="orders"
                              onClick={() => handleShowOrders(customer)}
                            />
                          </Tooltip>,
                        ]}
                      >
                        <Card.Meta
                          avatar={
                            <Avatar
                              style={{
                                backgroundColor:
                                  customer.payment_status === "חוב פתוח"
                                    ? "#ff4d4f"
                                    : "#52c41a",
                              }}
                            >
                              {customer.name[0]}
                            </Avatar>
                          }
                          title={
                            <span
                              style={{ fontSize: "1.1em", fontWeight: "bold" }}
                            >
                              {customer.name}
                            </span>
                          }
                          description={
                            <Space
                              direction="vertical"
                              size="small"
                              style={{ width: "100%", marginTop: 8 }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <PhoneOutlined />
                                <span style={{ flex: 1 }}>{customer.phone}</span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
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
              <ExportToExcel
                key="export"
                fileName={`נסיעות ${selectedCustomerName}`}
                data={prepareOrdersForExport()}
                columns={ordersExportColumns}
                buttonText="ייצא לאקסל"
              />,
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
          <Box mt={2}>
            <ExportToExcel
              fileName="דוח חובות"
              data={prepareDebtsForExport()}
              columns={debtsExportColumns}
              buttonText="ייצא דוח חובות"
              disabled={!groupedCustomers.debt.length}
            />
          </Box>
        </Box>
      </Spin>
    </ConfigProvider>
  );
};

export default CustomersTable;
