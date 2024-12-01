import { Button } from "antd";
import { FileExcelOutlined } from '@ant-design/icons';
import * as XLSX from "xlsx";

function ExportToExcel({
  data,
  columns,
  fileName = "exported_data",
  buttonText = "ייצא לאקסל",
  disabled = false,
  tableFilters = {}, // מקבל את הפילטרים הפעילים של הטבלה
}) {
  const exportToExcel = () => {
    // סינון הנתונים לפי הפילטרים הפעילים
    const filteredData = data.filter((record) => {
      return Object.entries(tableFilters).every(([key, filterValue]) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(record[key]);
      });
    });

    const excelData = filteredData.map((item) => {
      const row = {};
      columns.forEach((col) => {
        row[col.title] = col.render
          ? typeof col.render === "function"
            ? col.render(item[col.dataIndex], item)
            : item[col.dataIndex]
          : item[col.dataIndex];
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();

    // הגדרת תצוגת RTL לגיליון
    wb.Workbook = {
      Views: [{ RTL: true }],
    };

    XLSX.utils.book_append_sheet(wb, ws, "נתונים");

    XLSX.writeFile(
      wb,
      `${fileName}_${new Date().toLocaleDateString("he-IL")}.xlsx`
    );
  };

  return (
    <Button
      type="primary"
      variant="contained"
      onClick={exportToExcel}
      disabled={disabled}
      icon={<FileExcelOutlined />}
      style={{ 
        backgroundColor: '#28a745',
        borderColor: '#28a745',
      }}
    >
      {buttonText}
    </Button>
  );
}

export default ExportToExcel;
