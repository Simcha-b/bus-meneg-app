import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Button, Row, Col, Switch } from 'antd';
import { ExportOutlined, SendOutlined } from '@ant-design/icons';
// import axios from 'axios';

const { Option } = Select;

const Reports = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // הגדרת הפונקציה לשליחת הבקשה מהשרת
  const handleSubmit = async (values) => {
    // setLoading(true);
    // try {
    //   // שולח את הנתונים לשרת (פילטרים)
    //   const response = await axios.get('', {
    //     params: values, // שולח את כל הפילטרים
    //   });
    //   console.log('נתונים שהתקבלו:', response.data);
    //   // כאן תוכל להציג את הנתונים או לעבד אותם
    // } catch (error) {
    //   console.error('שגיאה בשאיבת הנתונים:', error);
    // }
    // setLoading(false);
  };

  const handleExport = () => {
    console.log('Exporting report...');
    // הוסף פונקציה לייצוא דוח
  };

  const handleSend = () => {
    console.log('Sending report...');
    // הוסף פונקציה לשליחת הדוח
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>בצע דוח</h2>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        style={{ maxWidth: 600 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="תאריך" name="date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="לקוח" name="client">
              <Select placeholder="בחר לקוח">
                <Option value="clientA">לקוח A</Option>
                <Option value="clientB">לקוח B</Option>
                {/* הוסף עוד אפשרויות */}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="מזמין" name="orderer">
              <Input placeholder="הכנס שם מזמין" />
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
    </div>
  );
};

export default Reports;
