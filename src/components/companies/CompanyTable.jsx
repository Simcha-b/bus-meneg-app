import React, { useEffect, useState } from "react";
import { getCompanies } from "../../services/companiesService";
import { getOrdersByCompanyId } from "../../services/ordersService";
import {
  Button,
  ConfigProvider,
  Table,
  Modal,
  Form,
  Input,
  List,
  Space,
} from "antd";
import heIL from "antd/lib/locale/he_IL";
import { Box } from "@mui/system";

const CompanyTable = () => {
  const [companies, setCompanies] = useState([]);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [isTripsModalOpen, setIsTripsModalOpen] = useState(false);
  const [tripDetails, setTripDetails] = useState([]);
  const [form] = Form.useForm();

  const fetchCompanies = async () => {
    try {
      const companies = await getCompanies();
      setCompanies(companies);
      
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    form.setFieldsValue({
      name: company.company_name,
      email: company.contact_email,
      phone: company.contact_phone,
    });
    setContacts(company.contacts || []);
    setIsCompanyModalOpen(true);
  };

  const handleAddNewCompany = () => {
    setSelectedCompany(null);
    form.resetFields();
    setContacts([]);
    setIsCompanyModalOpen(true);
  };

  const handleSaveCompany = () => {
    form.validateFields().then((values) => {
      if (selectedCompany) {
        // Implement update logic here
      } else {
        // Implement add logic here
        const newCompany = { ...values, contacts };
        setCompanies([...companies, newCompany]);
      }
      setIsCompanyModalOpen(false);
      setSelectedCompany(null);
    });
  };

  const handleCompanyModalClose = () => {
    setIsCompanyModalOpen(false);
    setSelectedCompany(null);
  };

  const handleAddContact = () => {
    setContacts([...contacts, newContact]);
    setNewContact({ name: "", phone: "" });
  };

  const handleRemoveContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleShowTrips = async (company) => {
    try {
      const trips = await getOrdersByCompanyId(company.company_id);
      const formattedTrips = trips.map(trip => ({
        ...trip,
        order_date: new Date(trip.order_date).toLocaleDateString('he-IL')
      }));
      setTripDetails(formattedTrips);
      setIsTripsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch trip details:", error);
    }
  };

  const handleTripsModalClose = () => {
    setIsTripsModalOpen(false);
    setTripDetails([]);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const columns = [
    {
      title: "שם",
      dataIndex: "company_name",
      key: "name",
      width: "20%",
    },
    {
      title: "אימייל",
      dataIndex: "contact_email",
      key: "email",
      width: "15%",
    },
    {
      title: "טלפון",
      dataIndex: "contact_phone",
      key: "phone",
    },
    {
      title: "ערוך פרטים",
      key: "edit",
      render: (_, record) => (
        <Button onClick={() => handleEditCompany(record)}>
          ערוך פרטי חברה
        </Button>
      ),
    },
    {
      title: "הצג פירוט נסיעות",
      key: "trips",
      render: (_, record) => (
        <Button onClick={() => handleShowTrips(record)}>
          הצג פירוט נסיעות
        </Button>
      ),
    },
  ];

  return (
    <ConfigProvider direction="rtl" locale={heIL}>
      <Box>
        <Box mb={2}>
          <Button type="primary" onClick={handleAddNewCompany}>
            הוסף חברה חדשה
          </Button>
        </Box>
        <Table
          dataSource={companies.map((company, index) => ({
            ...company,
            key: index,
          }))}
          columns={columns}
          bordered={true}
        />
        <Modal
          title={selectedCompany ? "ערוך פרטי חברה" : "הוסף חברה חדשה"}
          open={isCompanyModalOpen}
          onCancel={handleCompanyModalClose}
          onOk={handleSaveCompany}
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
        <Modal
          title="פירוט נסיעות"
          open={isTripsModalOpen}
          onCancel={handleTripsModalClose}
          footer={[
            <Button key="close" onClick={handleTripsModalClose}>
              סגור
            </Button>,
          ]}
        >
          <List
            dataSource={tripDetails}
            renderItem={(trip) => (
              <List.Item>
                {trip.order_date} - {trip.trip_details}
              </List.Item>
            )}
          />
        </Modal>
      </Box>
    </ConfigProvider>
  );
};

export default CompanyTable;