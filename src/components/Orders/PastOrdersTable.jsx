import { Table, ConfigProvider } from "antd";
import heIL from "antd/lib/locale/he_IL";
import { formatDate, getOrdersByDate } from "../../services/ordersService";
import { useEffect, useState } from "react";
import DeleteOrder from "../order-actions/DeleteOrder";
import ChangeStatus from "../order-actions/ChangeStatus";

function PastOrdersTable({ year, month }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //function to fetch orders
  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const orders = await getOrdersByDate(year, month);
      setData(orders);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }

  const dataSource = data.map((item) => ({
    ...item,
    key: item.order_id,
  }));
  const filters = [
    {
      text: "חסר שיבוץ",
      value: "חסר שיבוץ",
    },
    {
      text: "הושלם",
      value: "הושלם",
    },
    {
      text: "בוטל",
      value: "בוטל",
    },
    {
      text: "בתהליך",
      value: "בתהליך",
    },
    {
      text: "בביצוע",
      value: "בביצוע",
    },
  ];
  const columns = [
    {
      title: "מספר הזמנה",
      dataIndex: "order_id",
      key: "order_id",
      sorter: (a, b) => a.order_id - b.order_id,
      width: "5%",
    },
    {
      title: "תאריך",
      dataIndex: "order_date",
      key: "order_date",
      sorter: (a, b) => new Date(a.order_date) - new Date(b.order_date),
      render: (text) => formatDate(text),
    },
    {
      title: "שם המזמין",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      // onFilter: (value, record) => record.name.startsWith(value),
    },
    {
      title: "שעת התחלה",
      dataIndex: "start_time",
      key: "start_time",
      render: (text) => text.slice(0, 5),
    },
    {
      title: "שעת סיום",
      dataIndex: "end_time",
      key: "end_time",
      render: (text) => text.slice(0, 5),
    },
    {
      title: "כמות אוטבוסים",
      dataIndex: "bus_quantity",
      key: "bus_quantity",
      width: "5%",
    },
    {
      title: "פרטי נסיעה",
      dataIndex: "trip_details",
      key: "trip_details",
    },
    {
      title: "מבצע",
      dataIndex: "company_name",
      key: "company_name",
      sorter: (a, b) => a.company_name.localeCompare(b.company_name),
    },
    {
      title: "סטטוס",
      dataIndex: "status",
      key: "status",
      filters: filters,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "פעולות",
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <ChangeStatus order_id={record.order_id} fetchOrders={fetchOrders} />
          <DeleteOrder order_id={record.order_id} fetchOrders={fetchOrders} />
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider direction="rtl" locale={heIL}>
      <Table columns={columns} dataSource={dataSource} bordered={true} />
    </ConfigProvider>
  );
}

export default PastOrdersTable;
