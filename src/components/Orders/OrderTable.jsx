import { Table, ConfigProvider, Tag, Input, Spin } from "antd";
import heIL from "antd/lib/locale/he_IL";
import ExportToExcel from "../common/ExportToExcel";
import ExportToPDF from "../common/ExportToPDF";
import { formatDate, getOrders } from "../../services/ordersService";
import { useEffect, useState } from "react";
import DeleteOrder from "../order-actions/DeleteOrder";
import EditOrder from "../order-actions/EditOrder";
import OrderDetails from "../customers/OrderDetails";
import dayjs from "dayjs";
import "dayjs/locale/he";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import customParseFormat from "dayjs/plugin/customParseFormat";

// הוספת הפלאגינים הנדרשים
dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.locale("he");

const tagColors = {
  "חסר שיבוץ": "orange",
  "לא שולם": "red",
  "שולם חלקית": "blue",
  "נתוני תשלום חסרים": "purple",
};

function OrderTable({ viewType, selectedDate }) {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [tableFilters, setTableFilters] = useState({});

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.warn("No token found.");
      return;
    }
    fetchOrders();
  }, [selectedDate, viewType]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const orders = await getOrders();
      const filteredOrders = filterOrdersByDate(orders);
      const sortOrders = sortOrdersByDate(filteredOrders);
      setData(sortOrders);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrdersByDate = (orders) => {
    return orders.filter((order) => {
      const orderDate = dayjs(order.order_date);
      return orderDate.isSame(selectedDate, viewType);
    });
  };
  const sortOrdersByDate = (orders) => {
    const sortOrders = orders.sort((a, b) => {
      const dateA = new Date(a.order_date.split("T")[0]);
      const dateB = new Date(b.order_date.split("T")[0]);
      return dateA - dateB;
    });
    return sortOrders;
  };
  const getTableTitle = () => {
    if (!selectedDate) return "הזמנות";
    switch (viewType) {
      case "day":
        return `הזמנות ליום ${selectedDate.format("DD/MM/YYYY")}`;
      case "week": {
        const startOfWeek = selectedDate.startOf("week");
        const endOfWeek = selectedDate.endOf("week");
        return `הזמנות ${startOfWeek.format("DD/MM")} - ${endOfWeek.format(
          "DD/MM/YYYY"
        )}`;
      }
      case "month":
        return `הזמנות לחודש ${selectedDate.format("MM/YYYY")}`;
      default:
        return "הזמנות";
    }
  };

  const updateTags = (order) => {
    let tags = [];
    if (!order.company_id) tags.push("חסר שיבוץ");
    if (!order.price_per_bus_customer) tags.push("נתוני תשלום חסרים");
    if (!order.paid) tags.push("לא שולם");
    if (order.total_paid_customer > 0) tags.push("שולם חלקית");
    return tags;
  };

  const getColumnFilterProps = (dataIndex) => ({
    filters: [
      ...new Set(data.map((item) => item[dataIndex]).filter(Boolean)),
    ].map((text) => ({
      text: text,
      value: text,
    })),
    onFilter: (value, record) => record[dataIndex] === value,
    filterSearch: true,
  });

  const getFilteredData = () => {
    return data.filter((item) => {
      const searchFields = [
        item.customer_name,
        item.contact_name,
        item.company_name,
        item.order_date,
      ];
      return searchFields.some(
        (field) =>
          field &&
          field.toString().toLowerCase().includes(searchText.toLowerCase())
      );
    });
  };
  const exportColumns = [
    { title: "תאריך", dataIndex: "order_date", render: formatDate },
    { title: "שם לקוח", dataIndex: "customer_name" },
    { title: "איש קשר", dataIndex: "contact_name" },
    {
      title: "שעת התחלה",
      dataIndex: "start_time",
      render: (text) => text?.slice(0, 5) || "",
    },
    {
      title: "שעת סיום",
      dataIndex: "end_time",
      render: (text) => text?.slice(0, 5) || "",
    },
    { title: "כמות אוטובוסים", dataIndex: "bus_quantity" },
    { title: "פרטי נסיעה", dataIndex: "trip_details" },
    {
      title: "חברה מבצעת",
      dataIndex: "company_name",
      render: (text) => text || "לא שובץ",
    },
    // {
    //   title: "סטטוס",
    //   dataIndex: "tags",
    //   render: (_, record) => updateTags(record).join(", "),
    // },
    { title: "מחיר", dataIndex: "price_per_bus_customer" },
    { title: "סה״כ שולם", dataIndex: "total_paid_customer" },
  ];

  const columns = [
    {
      title: "תאריך",
      dataIndex: "order_date",
      key: "order_date",
      sorter: {
        compare: (a, b) => {
          if (!a.order_date) return -1;
          if (!b.order_date) return 1;
          const dateA = new Date(a.order_date.split("T")[0]);
          const dateB = new Date(b.order_date.split("T")[0]);
          return dateA - dateB;
        },
        multiple: 3,
      },
      render: (text) => formatDate(text),
    },
    {
      title: "שם לקוח",
      dataIndex: "customer_name",
      key: "customer_name",
      ...getColumnFilterProps("customer_name"),
      sorter: {
        compare: (a, b) => a.customer_name.localeCompare(b.customer_name),
        multiple: 2,
      },
      fixed: "left",
    },
    {
      title: "איש קשר",
      dataIndex: "contact_name",
      key: "contact_name",
      ...getColumnFilterProps("contact_name"),
      sorter: (a, b) => a.contact_name.localeCompare(b.contact_name),
      responsive: ["md"],
    },
    {
      title: "שעת התחלה",
      dataIndex: "start_time",
      key: "start_time",
      responsive: ["sm"],
      render: (text) => (text ? text.slice(0, 5) : null),
    },
    {
      title: "שעת סיום",
      dataIndex: "end_time",
      key: "end_time",
      responsive: ["sm"],
      render: (text) => (text ? text.slice(0, 5) : null),
    },
    {
      title: "כמות",
      dataIndex: "bus_quantity",
      key: "bus_quantity",
      width: "5%",
    },
    {
      title: "מבצע",
      dataIndex: "company_name",
      key: "company_name",
      ...getColumnFilterProps("company_name"),
      sorter: (a, b) => a.company_name?.localeCompare(b.company_name || ""),
      render: (text) => text || "לא שובץ",
      responsive: ["md"],
    },
    {
      title: "סטטוס",
      key: "tags",
      render: (_, record) => (
        <div>
          {updateTags(record).map((tag) => (
            <Tag key={tag} color={tagColors[tag]} style={{ marginRight: 5 }}>
              {tag}
            </Tag>
          ))}
        </div>
      ),
      responsive: ["md"],
    },
    {
      title: "פעולות",
      key: "action",
      fixed: "right",
      width: "15%",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <EditOrder order={record} fetchOrders={fetchOrders} />
          <DeleteOrder order_id={record.order_id} fetchOrders={fetchOrders} />
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setTableFilters(filters);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Spin size="large" />
        <span style={{ fontFamily: "Rubik, sans-serif" }}>טוען נתונים...</span>
      </div>
    );
  }

  if (error) {
    console.log("=====>", error);
    return <div>{error.message}</div>;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          padding: "10px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            fontFamily: "Rubik, sans-serif",
            fontWeight: "500",
          }}
        >
          {getTableTitle()}
        </h1>
      </div>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          flexDirection: window.innerWidth <= 768 ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: "10px",
          width: "100%",
        }}
      >
        <Input.Search
          placeholder="חיפוש..."
          allowClear
          enterButton
          onSearch={(value) => setSearchText(value)}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: window.innerWidth <= 768 ? "100%" : "300px",
            marginBottom: window.innerWidth <= 768 ? "10px" : "0",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "8px",
            width: window.innerWidth <= 768 ? "100%" : "auto",
          }}
        >
          <ExportToPDF
            data={getFilteredData()}
            columns={exportColumns}
            disabled={getFilteredData().length === 0}
            title={getTableTitle()}
            style={{
              flex: window.innerWidth <= 768 ? 1 : "initial",
              minWidth: window.innerWidth <= 768 ? "120px" : "auto",
            }}
          />
          <ExportToExcel
            data={getFilteredData()}
            columns={exportColumns}
            fileName={`הזמנות_`}
            disabled={getFilteredData().length === 0}
            tableFilters={tableFilters}  // העברת הפילטרים
            style={{
              flex: window.innerWidth <= 768 ? 1 : "initial",
              minWidth: window.innerWidth <= 768 ? "120px" : "auto",
            }}
          />
        </div>
      </div>

      <ConfigProvider direction="rtl" locale={heIL}>
        <Table
          loading={{
            spinning: isLoading,
            tip: "טוען נתונים...",
            size: "large",
          }}
          columns={columns}
          dataSource={getFilteredData().map((item) => ({
            ...item,
            key: item.order_id,
          }))}
          bordered={true}
          scroll={{ x: "max-content" }}
          size={window.innerWidth <= 768 ? "small" : "middle"}
          pagination={{
            responsive: true,
            position: ["bottomCenter"],
            showSizeChanger: window.innerWidth > 768,
            showQuickJumper: window.innerWidth > 768,
            defaultPageSize: window.innerWidth <= 768 ? 10 : 20,
          }}
          expandable={{
            expandedRowRender: (record) => (
              <div
                style={{
                  margin: 0,
                  padding: "0 8px",
                  backgroundColor: "#fafafa",
                }}
              >
                <OrderDetails order={record} fetchOrders={fetchOrders} />
              </div>
            ),
            expandedRowKeys,
            onExpandedRowsChange: (newExpandedRows) => {
              setExpandedRowKeys(newExpandedRows);
            },
          }}
          onChange={handleTableChange}
        />
      </ConfigProvider>
    </div>
  );
}

export default OrderTable;
