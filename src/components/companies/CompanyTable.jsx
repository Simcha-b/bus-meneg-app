import React, { useEffect, useState } from "react";
import { getCompanies, addCompany, deleteCompany } from "../../services/companiesService";
import { getOrdersByCompanyId } from "../../services/ordersService";
import {
  Button,
  ConfigProvider,
  Table,
  Modal,
  Form,
  List,
  message,
  Popconfirm,
  Dropdown
} from "antd";
import { MoreOutlined } from '@ant-design/icons';
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
        await fetchCompanies(); // רענון הטבלה
        message.success('החברה נוספה בהצלחה');
      }
      setIsCompanyModalOpen(false);
      setSelectedCompany(null);
      form.resetFields();
    } catch (error) {
      console.error("Failed to save company:", error);
      message.error('שגיאה בהוספת החברה. אנא נסה שנית.');
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

  const handleDeleteCompany = async (company) => {
    try {
      await deleteCompany(company.company_id);
      await fetchCompanies();
      message.success('החברה נמחקה בהצלחה');
    } catch (error) {
      console.error("Failed to delete company:", error);
      message.error('שגיאה במחיקת החברה. אנא נסה שנית.');
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const getActionsMenu = (record) => ({
    items: [
      {
        key: '1',
        label: 'הצג פירוט נסיעות',
        onClick: () => handleShowTrips(record)
      },
      {
        key: '2',
        label: 'ערוך פרטי חברה',
        onClick: () => handleEditCompany(record)
      },
      {
        key: '3',
        label: 'מחק חברה',
        danger: true,
        onClick: (e) => {
          // מונע מהדרופדאון להיסגר לפני שמופיע הפופאפ
          e.stopPropagation();
          Modal.confirm({
            title: 'מחיקת חברה',
            content: 'האם אתה בטוח שברצונך למחוק את החברה?',
            okText: 'כן',
            cancelText: 'לא',
            okType: 'danger',
            onOk: () => handleDeleteCompany(record)
          });
        }
      },
    ]
  });

  const columns = [
    {
      title: "שם",
      dataIndex: "company_name",
      key: "name",
      width: "25%",
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: "אימייל",
      dataIndex: "contact_email",
      key: "email",
      width: "25%",
      responsive: ['sm', 'md', 'lg', 'xl'],
    },
    {
      title: "טלפון",
      dataIndex: "contact_phone",
      key: "phone",
      width: "25%",
      responsive: ['sm', 'md', 'lg', 'xl'],
    },
    {
      title: "פעולות",
      key: "actions",
      width: "15%",
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      render: (_, record) => (
        <Dropdown
          menu={getActionsMenu(record)}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    }
  ];

  return (
    <ConfigProvider direction="rtl" locale={heIL}>
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
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
          scroll={{ x: 'max-content' }}
          pagination={{
            responsive: true,
            position: ['bottomCenter'],
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} מתוך ${total} תוצאות`,
          }}
        />
        <Modal
          title={selectedCompany ? "ערוך פרטי חברה" : "הוסף חברה חדשה"}
          open={isCompanyModalOpen}
          onCancel={handleCompanyModalClose}
          onOk={handleSaveCompany}
          okText={selectedCompany ? "עדכן" : "הוסף"}
          cancelText="בטל"
        >
          <CompanyForm 
            form={form} 
            initialValues={selectedCompany}
          />
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