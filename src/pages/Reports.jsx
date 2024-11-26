import React, { useState } from "react";
import { Button, Select, Form, Input, DatePicker, Table } from "antd";
import ExportToExcel from  "../components/common/ExportToExcel";

const { Option } = Select;

const Reports = () => {
  const [reportType, setReportType] = useState(null);
  const [filters, setFilters] = useState({});
  const [generatedReports, setGeneratedReports] = useState([]);

  const handleGenerateReport = () => {
    // Generate report based on reportType and filters
    const newReport = {
      id: generatedReports.length + 1,
      type: reportType,
      filters,
      date: new Date().toLocaleString(),
    };
    setGeneratedReports([...generatedReports, newReport]);
  };

  const columns = [
    {
      title: "סוג דוח",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "פילטרים",
      dataIndex: "filters",
      key: "filters",
      render: (filters) => JSON.stringify(filters),
    },
    {
      title: "תאריך הנפקה",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "פעולות",
      key: "actions",
      render: (text, record) => (
        <ExportToExcel
        //   data={/* הנתונים של הדוח */}
        //   columns={/* העמודות של הדוח */}
          fileName={`report_${record.id}`}
          buttonText="הורד"
        />
      ),
    },
  ];

  return (
    <div>
      <h1>עמוד דוחות</h1>
      <Form layout="inline" onFinish={handleGenerateReport}>
        <Form.Item label="סוג דוח" name="reportType" rules={[{ required: true, message: "נא לבחור סוג דוח" }]}>
          <Select style={{ width: 200 }} onChange={(value) => setReportType(value)}>
            <Option value="orders">דוח הזמנות</Option>
            <Option value="customers">דוח לקוחות</Option>
            {/* אפשרויות נוספות */}
          </Select>
        </Form.Item>
        <Form.Item label="תאריך התחלה" name="startDate">
          <DatePicker onChange={(date) => setFilters({ ...filters, startDate: date })} />
        </Form.Item>
        <Form.Item label="תאריך סיום" name="endDate">
          <DatePicker onChange={(date) => setFilters({ ...filters, endDate: date })} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            הנפק דוח
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={generatedReports} columns={columns} rowKey="id" />
    </div>
  );
};

export default Reports;