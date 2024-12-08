import React, { useEffect, useState } from "react";
import { getCompanies, addCompany } from "../../services/companiesService";
import { getOrdersByCompanyId } from "../../services/ordersService";
import {
  Button,
  ConfigProvider,
  Table,
  Modal,
  Form,
  List,
} from "antd";
import heIL from "antd/lib/locale/he_IL";
import { Box } from "@mui/system";
import CompanyForm from "./CompanyForm";

const CompanyTable = () => {
  const [companies, setCompanies] = useState([]);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
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
    setIsCompanyModalOpen(true);
  };

  const handleAddNewCompany = () => {
    setSelectedCompany(null);
    form.resetFields();
    setIsCompanyModalOpen(true);
  };

  const handleSaveCompany = async () => {
    try {
      const values = await form.validateFields();
      if (selectedCompany) {
        // Implement update logic here
      } else {
        const newCompanyData = {
          company_name: values.name,
          contact_name: values.contact_name,
          contact_email: values.contact_email,
          contact_phone: values.contact_phone,
        };
        
        const savedCompany = await addCompany(newCompanyData);
        setCompanies([...companies, savedCompany]);
      }
      setIsCompanyModalOpen(false);
      setSelectedCompany(null);
      form.resetFields();
    } catch (error) {
      console.error("Failed to save company:", error);
    }
  };

  const handleCompanyModalClose = () => {
    setIsCompanyModalOpen(false);
    setSelectedCompany(null);
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
          <CompanyForm form={form} initialValues={selectedCompany} />
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