import React from "react";
import CompanyTable from "../components/companies/CompanyTable";
import { Typography } from "@mui/material";

function Companies() {
  return (
    <div>
      <Typography variant="h4" component="h1" align="center">
        טבלת ספקים
      </Typography>
      <CompanyTable />
    </div>
  );
}

export default Companies;
