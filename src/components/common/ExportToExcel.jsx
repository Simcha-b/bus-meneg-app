import { Button, Modal, Checkbox, Input, message } from "antd";
import { FileExcelOutlined } from '@ant-design/icons';
import SendMail from "../../services/SendMail";
import * as XLSX from "xlsx";
import { useState } from "react";

function ExportToExcel({
  data,
  columns,
  fileName = "exported_data",
  buttonText = "ייצא - אקסל",
  disabled = false,
  tableFilters = {}, // מקבל את הפילטרים הפעילים של הטבלה

}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [download, setDownload] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);
  const [email, setEmail] = useState("");
  let wb;

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
    wb = XLSX.utils.book_new();

    // הגדרת תצוגת RTL לגיליון
    wb.Workbook = {
      Views: [{ RTL: true }],
    };

    XLSX.utils.book_append_sheet(wb, ws, "נתונים");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excelBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    return excelBlob;
  };

  const handleExportClick = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const excelBlob = exportToExcel();
    
    try {
      if (download) {
        XLSX.writeFile(wb, `${fileName}_${new Date().toLocaleDateString("he-IL")}.xlsx`);
      }
      
      if (sendEmail) {
        const result = await SendMail(
          excelBlob,
          `${fileName}_${new Date().toLocaleDateString("he-IL")}.xlsx`,
          {
            email: email || "b5860344@gmail.com",
            subject: `${fileName} - דוח מערכת דרך הישר`,
            body: `שלום,
            
מצורף ${fileName} שהופק ממערכת דרך הישר.

בברכה,
צוות דרך הישר`,
          }
        );

        if (result.success) {
          message.success("הקובץ נשלח בהצלחה למייל");
        } else {
          message.error("שגיאה בשליחת המייל");
        }
      }

      setIsModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error("אירעה שגיאה בייצוא הקובץ");
    }
  };

  return (
    <>
      <Button
        type="primary"
        variant="contained"
        onClick={handleExportClick}
        disabled={disabled}
        icon={<FileExcelOutlined />}
        style={{ 
          backgroundColor: '#28a745',
          borderColor: '#28a745',
        }}
      >
        {buttonText}
      </Button>
      <Modal
        title="בחר פעולה"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="בצע"
        cancelText="בטל"
      >
        <Checkbox
          checked={download}
          onChange={(e) => setDownload(e.target.checked)}
        >
          הורדת הקובץ
        </Checkbox>
        <Checkbox
          checked={sendEmail}
          onChange={(e) => setSendEmail(e.target.checked)}
        >
          שליחה במייל
        </Checkbox>
        {sendEmail && (
          <Input
            placeholder="הכנס כתובת מייל נוספת (אופציונלי)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginTop: 16 }}
          />
        )}
      </Modal>
    </>
  );
}
export default ExportToExcel;
