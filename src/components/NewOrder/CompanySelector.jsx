import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { getCompanies } from "../../services/companiesService.js";
import AddNewCompany from "../companies/AddNewCompany.jsx"; // קומפוננטה להוספת חברה חדשה
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
} from "@mui/material";

export function CompanySelector({ setFormData, formData }) {
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
        <Box sx={{ maxWidth: "600px" }}>
          <AddNewCompany onSuccess={handleNewCompanySuccess} />
        </Box>
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
    </Box>
  );
}
