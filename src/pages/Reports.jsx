import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Button, Row, Col, Switch, ConfigProvider } from 'antd';
import { ExportOutlined, SendOutlined } from '@ant-design/icons';
import heIL from "antd/lib/locale/he_IL";
import axios from 'axios';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Reports = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleSubmit = async (values) => {
    setLoading(true);
    let query = {};

    if (reportType === 'client') {
      query = {
        date: values.date,
        client: values.client,
        orderer: values.orderer,
        pricing: values.pricing,
        invoiceToClient: values.invoiceToClient,
      };
    } else if (reportType === 'orderer') {
      query = {
        date: values.date,
        orderer: values.orderer,
      };
    } else if (reportType === 'supplier') {
      query = {
        date: values.date,
        supplier: values.supplier,
        invoiceToSupplier: values.invoiceToSupplier,
        paidStatus: values.paidStatus,
      };
    }

    try {
      // שולח את הנתונים לשרת (פילטרים)
      const response = await axios.get('/api/reports', {
        params: query, // שולח את כל הפילטרים
      });
      console.log('נתונים שהתקבלו:', response.data);
      // כאן תוכל להציג את הנתונים או לעבד אותם
    } catch (error) {
      console.error('שגיאה בשאיבת הנתונים:', error);
    }
    setLoading(false);
  };

  const handleExport = () => {
    console.log('Exporting report...');
    // הוסף פונקציה לייצוא דוח
  };

  const handleSend = () => {
    console.log('Sending report...');
    // הוסף פונקציה לשליחת הדוח
  };

  const handleReportTypeChange = (value) => {
    setReportType(value);
  };

  const handleClientChange = (value) => {
    setSelectedClient(value);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>בצע דוח</h2>
      <ConfigProvider  direction="rtl" locale={heIL}>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="סוג דוח" name="reportType">
          <Select placeholder="בחר סוג דוח" onChange={handleReportTypeChange}>
            <Option value="client">לקוח</Option>
            <Option value="supplier">חברה</Option>
          </Select>
        </Form.Item>

        {reportType === 'client' && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="תאריך" name="date">
                  <RangePicker />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="לקוח" name="client">
                  <Select placeholder="בחר לקוח" onChange={handleClientChange}>
                    <Option value="clientA">לקוח A</Option>
                    <Option value="clientB">לקוח B</Option>
                    {/* הוסף עוד אפשרויות */}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {selectedClient && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="איש קשר" name="orderer">
                    <Select placeholder="בחר איש קשר">
                      <Option value="contactA">איש קשר A</Option>
                      <Option value="contactB">איש קשר B</Option>
                      {/* הוסף עוד אפשרויות */}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="סטטוס תמחור" name="pricing">
                  <Select placeholder="בחר סטטוס תמחור">
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

        {reportType === 'orderer' && (
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

        {reportType === 'supplier' && (
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
                    {/* הוסף עוד אפשרויות */}
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
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginRight: 20 }}
          >
            בצע דוח
          </Button>
          <Button
            icon={<ExportOutlined />}
            type="default"
            onClick={handleExport}
            style={{ marginRight: 20 }}
          >
            ייצא דוח
          </Button>
          <Button
            icon={<SendOutlined />}
            type="default"
            onClick={handleSend}
          >
            שלח דוח
          </Button>
        </div>
      </Form>
      </ConfigProvider>
    </div>
  );
};

export default Reports;
