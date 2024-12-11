import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  Switch,
  ConfigProvider,
  AutoComplete,
} from "antd";
import { ExportOutlined, SendOutlined } from "@ant-design/icons";
import heIL from "antd/lib/locale/he_IL";
import { getCustomers } from "../services/customersService";
import { getContactsByCustomerId } from "../services/contactService";
import { getOrders } from "../services/ordersService";
import axios from "axios";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Reports = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerList, setCustomerList] = useState([]);
  const [contactList, setContactList] = useState([]);

  const fetchCustomerList = async () => {
    try {
      const customers = await getCustomers();
      setCustomerList(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchContactList = async () => {
    try {
      if (selectedCustomer) {
        const contacts = await getContactsByCustomerId(selectedCustomer.customer_id);
        setContactList(contacts);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleClientSearch = () => {
    if (reportType === "client") {
      fetchCustomerList();
    }
  };

  const handleContactSearch = () => {
    if (reportType === "client") {
      fetchContactList();
    }
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    let queryParameters = {};

    if (reportType === "client") {
      queryParameters = {
        date: values.date,
        client: values.client,
        orderer: values.orderer,
        pricing: values.pricing,
        invoiceToClient: values.invoiceToClient,
      };
    } else if (reportType === "orderer") {
      queryParameters = {
        date: values.date,
        orderer: values.orderer,
      };
    } else if (reportType === "supplier") {
      queryParameters = {
        date: values.date,
        supplier: values.supplier,
        invoiceToSupplier: values.invoiceToSupplier,
        paidStatus: values.paidStatus,
      };
    }

    try {
      const response = await axios.get("/api/reports", {
        params: queryParameters,
      });
      console.log("Received data:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const handleExport = () => {
    console.log("Exporting report...");
  };

  const handleSend = () => {
    console.log("Sending report...");
  };

  const handleReportTypeChange = (value) => {
    setReportType(value);
  };

  const handleCustomerChange = (value) => {
    setSelectedCustomer(value);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>דוחו"ת</h2>
      <ConfigProvider direction="rtl" locale={heIL}>
        <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item label="סוג דוח" name="reportType">
            <Select placeholder="בחר סוג דוח" onChange={handleReportTypeChange} style={{ width: "20%" }}>
              <Option value="client">לקוח</Option>
              <Option value="supplier">ספק</Option>
              <Option value="orderer">נסיעות</Option>
            </Select>
          </Form.Item>

          {reportType === "client" && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="תאריך" name="date">
                    <RangePicker />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="לקוח" name="client">
                    <AutoComplete
                      options={customerList.map((customer) => ({
                        value: customer.name,
                      }))}
                      placeholder="בחר לקוח"
                      onChange={handleCustomerChange}
                      onSearch={handleClientSearch}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {selectedCustomer && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="איש קשר" name="orderer">
                      <AutoComplete
                        options={contactList.map((contact) => ({
                          value: contact.name,
                        }))}
                        placeholder="בחר איש קשר"
                        onSearch={handleContactSearch}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="סטטוס תמחור" name="pricing">
                    <Select placeholder="בחר סטטוס תמחור" style={{ width: "50%" }}>
                      <Option value="withPricing">עם תמחור</Option>
                      <Option value="withoutPricing">ללא תמחור</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="חשבונית ללקוח" name="invoiceToClient" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          {reportType === "orderer" && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="תאריך" name="date">
                    <RangePicker />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="איש קשר" name="orderer">
                    <Input placeholder="בחר איש קשר" />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          {reportType === "supplier" && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="תאריך" name="date">
                    <RangePicker />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="ספק" name="supplier">
                    <Select placeholder="בחר ספק">
                      <Option value="supplierA">ספק A</Option>
                      <Option value="supplierB">ספק B</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="חשבונית לספק" name="invoiceToSupplier" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="סטטוס תשלום" name="paidStatus">
                    <Select placeholder="בחר סטטוס תשלום">
                      <Option value="paid">שולם</Option>
                      <Option value="partiallyPaid">שולם חלקית</Option>
                      <Option value="notPaid">לא שולם</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          <div style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit" loading={isLoading} style={{ marginRight: 20 }}>
              הכן דוח
            </Button>
            <Button icon={<ExportOutlined />} type="default" onClick={handleExport} style={{ marginRight: 20 }}>
              ייצא דוח
            </Button>
            <Button icon={<SendOutlined />} type="default" onClick={handleSend}>
              שלח דוח
            </Button>
          </div>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default Reports;
