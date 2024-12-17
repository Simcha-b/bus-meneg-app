import { Button } from 'antd'
import React from 'react'
import CustomersTable from '../components/customers/CustomersTable'
import { Typography } from '@mui/material'

function Customers() {
  return (
    <div>
      {/* <Typography variant="h5" component="h3" align="center" >
        לקוחות 
      </Typography> */}
      <br></br>
      <CustomersTable />
    </div>
  )
}

export default Customers