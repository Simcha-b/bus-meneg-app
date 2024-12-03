import React from "react";
import { Button } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";
import AlefRegular from "../../fonts/Alef-Regular.ttf";

Font.register({ family: "Alef", src: AlefRegular });

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
    direction: "rtl", // Add RTL support
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    direction: "rtl",
  },
  title: {
    fontFamily: "Alef",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontFamily: "Alef",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "10%", // עדכון רוחב העמודות כדי שיתאימו לתצוגת landscape
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 12,
    fontFamily: "Alef",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
});

const PDFDocument = ({ data, columns, title = 'נתוני טבלה' }) => {

  if (!data?.length || !columns?.length) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>אין נתונים להציג</Text>
          </View>
        </Page>
      </Document>
    );
  }

  // נהפוך את סדר העמודות
  const reversedColumns = [...columns].reverse();

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.table}>
            {/* Table Headers */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              {reversedColumns.map((column, index) => (
                <View style={styles.tableCol} key={index}>
                  <Text style={styles.tableCell}>{column.title}</Text>
                </View>
              ))}
            </View>
            {/* Table Data */}
            {data.map((row, i) => (
              <View style={styles.tableRow} key={i}>
                {reversedColumns.map((column, index) => {
                  const value = column.render 
                    ? column.render(row[column.dataIndex], row)
                    : row[column.dataIndex];
                  
                  return (
                    <View style={styles.tableCol} key={index}>
                      <Text style={styles.tableCell}>
                        {value != null ? String(value) : '—'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

const ExportToPDF = ({ data, columns, disabled, title }) => {
  const [isError, setIsError] = React.useState(false);

  if (isError) {
    return <Button danger disabled>שגיאה בייצוא PDF</Button>;
  }

  return (
    <PDFDownloadLink
      document={<PDFDocument data={data} columns={columns} title={title} />}
      fileName="table-data.pdf"
      onError={(error) => {
        console.error('PDF Export Error:', error);
        setIsError(true);
      }}
    >
      {({ blob, url, loading, error }) => (
        <Button
          icon={<FilePdfOutlined />}
          disabled={disabled || loading || !data?.length}
          type="primary"
          style={{ marginRight: "8px" }}
        >
          {loading ? 'מכין PDF...' : 'ייצא -PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default ExportToPDF;
