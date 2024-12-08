import React, { useState } from "react";
import { Form, Input, Button } from "antd";

const CompanyForm = ({ form, initialValues, onFinish }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await onFinish(values);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.company_name,
        contact_name: initialValues.contact_name,
        email: initialValues.email,
        phone: initialValues.phone,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="name"
        label="שם"
        rules={[{ required: true, message: "נא להזין שם" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="contact_name"
        label="איש קשר"
        rules={[{ required: true, message: "נא להזין איש קשר" }]}
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
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? 'עדכן חברה' : 'הוסף חברה'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CompanyForm;