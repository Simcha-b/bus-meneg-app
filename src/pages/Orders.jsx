import React, { useState } from "react";
import { Box } from "@mui/system";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { DatePicker, ConfigProvider} from "antd";
import heIL from "antd/lib/locale/he_IL";
import OrderTable from "../components/Orders/OrderTable";
import dayjs from 'dayjs';
import 'dayjs/locale/he'; // הוספת תמיכה בעברית

function Orders() {
  const [viewType, setViewType] = useState("month");
  const [selectedDate, setSelectedDate] = useState(dayjs()); 

  const handleViewTypeChange = (event, newValue) => {
    if (newValue !== null) {
      setViewType(newValue);
      setSelectedDate(dayjs());
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        mb: 4,
      }}>
        <ToggleButtonGroup
          value={viewType}
          exclusive
          onChange={handleViewTypeChange}
          aria-label="view type selection"
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
          <ToggleButton value="month">חודש</ToggleButton>
          <ToggleButton value="week">שבוע</ToggleButton>
          <ToggleButton value="day">יום</ToggleButton>
        </ToggleButtonGroup>
        <ConfigProvider direction="rtl" locale={heIL}>
        <DatePicker
          picker={viewType === "month" ? "month" : viewType === "week" ? "week" : "date"}
          format={viewType === "month" ? "MM/YYYY" : "DD/MM/YYYY"}
          onChange={(date) => setSelectedDate(date ? date : dayjs())}
          value={selectedDate}
          style={{ width: 200 }}
        />
        </ConfigProvider >
      </Box>

      <OrderTable viewType={viewType} selectedDate={selectedDate} />
    </Box>
  );
}

export default Orders;
