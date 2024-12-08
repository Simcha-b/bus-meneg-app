import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { getCompanies } from "../../services/companiesService.js";
import CompanyForm from "../companies/CompanyForm.jsx"; // קומפוננטה להוספת חברה חדשה
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  Button
} from "@mui/material";
import {Form, Modal, notification } from "antd";
import { addCompany } from "../../services/companiesService";

export function CompanySelector({ setFormData, formData }) {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState("old"); // בחירת מצב - חברה קיימת או חדשה
  const [selectedCompany, setSelectedCompany] = useState(null);

  const { data: companies, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  useEffect(() => {
    if (formData?.company_id && companies) {
      const company = companies.find(
        (com) => com.company_id === formData.company_id
      );
      setSelectedCompany(company);
    }
  }, [formData?.company_id, companies]);

  useEffect(() => {
    if (selectedCompany) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        company_id: selectedCompany.company_id,
      }));
    }
  }, [selectedCompany, setFormData]);

  const handleNewCompanySuccess = (newCompany) => {
    setValue("old"); // חזרה למצב "חברה קיימת"
    setSelectedCompany(newCompany);
    setFormData((prev) => ({
      ...prev,
      company_id: newCompany.company_id,
    }));
  };

  const handleNewCompanySubmit = async (values) => {
    try {
      const newCompanyData = {
        company_name: values.name,
        contact_email: values.email,
        contact_phone: values.phone,
      };
      
      const savedCompany = await addCompany(newCompanyData);
      handleNewCompanySuccess(savedCompany);
      form.resetFields();
      setIsModalOpen(false);
      notification.success({
        message: 'החברה נוספה בהצלחה',
        description: `החברה ${savedCompany.company_name} נוספה בהצלחה למערכת`,
        placement: 'topRight',
        rtl: true
      });
    } catch (error) {
      notification.error({
        message: 'שגיאה בהוספת החברה',
        description: 'אירעה שגיאה בעת הוספת החברה. אנא נסה שוב',
        placement: 'topRight',
        rtl: true
      });
      console.error("Failed to add company:", error);
    }
  };

  const companyOptions = companies || [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
      <FormControl>
        <RadioGroup
          row
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={{ mb: 1 }}
        >
          <FormControlLabel
            value="old"
            control={<Radio size="small" />}
            label="חברה קיימת"
            sx={{ mr: 1 }}
          />
          <FormControlLabel
            value="new"
            control={<Radio size="small" />}
            label="חברה חדשה"
          />
        </RadioGroup>
      </FormControl>

      {value === "new" ? (
        <Button onClick={() => setIsModalOpen(true)}
        variant="contained"
        size="small"
              >
          הוסף חברה חדשה
        </Button>
      ) : (
        <Autocomplete
          size="small"
          disablePortal
          id="company"
          options={companyOptions}
          getOptionLabel={(option) => option.company_name}
          loading={isLoadingCompanies}
          value={selectedCompany}
          sx={{ width: 300 }}
          onChange={(event, value) => {
            setSelectedCompany(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="בחר חברה"
            />
          )}
        />
      )}

      <Modal
        title="הוספת חברה חדשה"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <CompanyForm 
          form={form} 
          onFinish={handleNewCompanySubmit}
        />
      </Modal>
    </Box>
  );
}
