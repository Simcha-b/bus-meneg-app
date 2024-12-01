import { Button } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
// import "../../fonts/Alef-Bold-normal";
// import "../../fonts/Alef-Regular-normal";
import { formatDate } from "../../services/ordersService";

const ExportToPDF = ({ data, disabled }) => {
  const exportToPDF = () => {
    const doc = new jsPDF("l", "mm", "a4");

    // doc.addFileToVFS("Alef-Bold-normal.ttf", "Alef-Bold-normal");
    // doc.addFont("Alef-Bold-normal.ttf", "Alef-Bold-normal", "normal");
    // doc.setFont("Alef-Bold-normal");    
    // doc.setR2L(true);


    const tableColumn = [
      "תאריך",
      "שם לקוח",
      "איש קשר",
      "שעת התחלה",
      "שעת סיום",
      "כמות",
      "חברה מבצעת",
      "סטטוס",
      "מחיר",
      "שולם",
    ];

    const tableRows = data.map((item) => [
      formatDate(item.order_date),
      item.customer_name,
      item.contact_name,
      item.start_time?.slice(0, 5) || "",
      item.end_time?.slice(0, 5) || "",
      item.bus_quantity,
      item.company_name || "לא שובץ",
      updateTags(item).join(", "),
      item.price_per_bus_customer || "",
      item.total_paid_customer || "",
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: {
        font: "helvetica",
        halign: "right",
        fontSize: 8,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        fontSize: 9,
        halign: "right",
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 15 },
        6: { cellWidth: 25 },
        7: { cellWidth: 30 },
        8: { cellWidth: 20 },
        9: { cellWidth: 20 },
      },
      margin: { top: 10 },
    });

    // Add header
    doc.setFontSize(16);
    doc.text("דוח הזמנות", doc.internal.pageSize.width - 20, 20, {
      align: "right",
    });

    doc.save("הזמנות.pdf");
  };

  const updateTags = (order) => {
    let tags = [];
    if (!order.company_id) tags.push("חסר שיבוץ");
    if (!order.price_per_bus_customer) tags.push("נתוני תשלום חסרים");
    if (!order.paid) tags.push("לא שולם");
    if (order.total_paid_customer > 0) tags.push("שולם חלקית");
    return tags;
  };

  return (
    <Button
      icon={<FilePdfOutlined />}
      onClick={exportToPDF}
      disabled={disabled}
      type="primary"
      style={{ marginRight: "8px" }}
    >
      ייצא ל-PDF
    </Button>
  );
};

export default ExportToPDF;
