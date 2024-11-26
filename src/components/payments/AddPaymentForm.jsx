import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Modal } from "antd";

const AddPaymentForm = ({ visible, onClose, onPaymentAdded, order }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await fetch("http://localhost:3001/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: order.order_id,
          customer_id: order.customer_id,
          amount: values.amount,
          payment_date: values.payment_date.format("YYYY-MM-DD"),
        }),
      });

      form.resetFields();
      onPaymentAdded();
      onClose();
    } catch (error) {
      console.error("Failed to add payment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Add Payment"
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: "Please input the amount" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="payment_date"
          label="Payment Date"
          rules={[
            { required: true, message: "Please select the payment date" },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Payment
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPaymentForm;
