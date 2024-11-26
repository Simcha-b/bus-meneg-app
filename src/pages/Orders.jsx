import React, { useState } from "react";
import { Box } from "@mui/system";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import OrderTable from "../components/Orders/OrderTable";

function Orders() {
  const [tableType, setTableType] = useState("future");

  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      setTableType(newValue);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 4,
        }}
      >
        <ToggleButtonGroup
          value={tableType}
          exclusive
          onChange={handleChange}
          aria-label="order type selection"
          sx={{
            backgroundColor: 'background.paper',
            boxShadow: 1,
            borderRadius: 2,
            '& .MuiToggleButton-root': {
              px: 3,
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 500,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }
            }
          }}
        >
          <ToggleButton value="future">
            הזמנות עתידיות
          </ToggleButton>
          <ToggleButton value="past">
            הזמנות לפי חודש
          </ToggleButton>
          <ToggleButton value="all">
            כל ההזמנות
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <OrderTable tableType={tableType} />
    </Box>
  );
}

export default Orders;
