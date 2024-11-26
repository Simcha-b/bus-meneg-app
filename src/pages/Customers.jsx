import { Button } from 'antd'
import React from 'react'
import CustomersTable from '../components/customers/CustomersTable'
import { Typography } from '@mui/material'

function Customers() {
  return (
    <div>
      <Typography variant="h4" component="h1" align="center">
         טבלת לקוחות 
      </Typography>
      <CustomersTable />
    </div>
  )
}

export default Customers