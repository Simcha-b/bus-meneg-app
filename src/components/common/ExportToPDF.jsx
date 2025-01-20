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
    direction: "rtl",
  },
  section: {
    margin: 20,
    padding: 20,
    flexGrow: 1,
    direction: "rtl",
  },
  title: {
    fontFamily: "Alef",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 30,
    color: "#2c3e50",
    borderBottom: 2,
    borderBottomColor: "#34495e",
    paddingBottom: 10,
  },
  text: {
    fontFamily: "Alef",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#2c3e50",
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bdc3c7",
    marginVertical: 15,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    minHeight: 35,
  },
  tableRowEven: {
    backgroundColor: "#f8f9fa",
  },
  tableCol: {
    width: "10%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bdc3c7",
    justifyContent: "center",
    padding: 8,
  },
  tableCell: {
    margin: 5,
    fontSize: 12,
    fontFamily: "Alef",
    textAlign: "center",
  },
  tableHeader: {
    backgroundColor: "#34495e",
  },
  headerCell: {
    margin: 5,
    fontSize: 14,
    fontFamily: "Alef",
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#95a5a6",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 30,
    fontSize: 10,
    color: "#95a5a6",
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

  const reversedColumns = [...columns].reverse();
  const currentDate = new Date().toLocaleDateString('he-IL');

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
                  <Text style={styles.headerCell}>{column.title}</Text>
                </View>
              ))}
            </View>
            {/* Table Data */}
            {data.map((row, i) => (
              <View style={[
                styles.tableRow,
                i % 2 === 0 ? styles.tableRowEven : {}
              ]} key={i}>
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
          <Text style={styles.footer}>
            {`הופק בתאריך: ${currentDate}`}
          </Text>
          <Text 
            style={styles.pageNumber} 
            render={({ pageNumber, totalPages }) => (
              `${pageNumber} / ${totalPages}`
            )} 
          />
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
