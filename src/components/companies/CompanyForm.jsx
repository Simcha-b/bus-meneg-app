import React from "react";
import { Form, Input, Button } from "antd";

const CompanyForm = ({ form, initialValues }) => {
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
    <Form form={form} layout="vertical">
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
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="טלפון"
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default CompanyForm;