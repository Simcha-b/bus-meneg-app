import { Table, ConfigProvider, Tag, Input } from "antd";
import heIL from "antd/lib/locale/he_IL";
import ExportToExcel from '../common/ExportToExcel';
import {
  formatDate,
  getFutureOrders,
  getOrders,
  getOrdersByDate,
} from "../../services/ordersService";
import { useEffect, useState } from "react";
import DeleteOrder from "../order-actions/DeleteOrder";
import EditOrder from "../order-actions/EditOrder";
import OrderDetails from "../customers/OrderDetails";
import ChooseYearAndMonth from "./ChooseYearAndMonth";

const tagColors = {
  "חסר שיבוץ": "orange",
  "לא שולם": "red",
  "שולם חלקית": "blue",
  "נתוני תשלום חסרים": "purple",
};

function OrderTable({ tableType }) {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [tableFilters, setTableFilters] = useState({});

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (tableType === "past") {
        console.log(year, month);
        const orders = await getOrdersByDate(year, month);
        setData(orders);
      } else if (tableType === "future") {
        const orders = await getFutureOrders();
        setData(orders);
      } else {
        const orders = await getOrders();
        console.log(orders);
        setData(orders);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [tableType, year, month]);

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
    { title: 'תאריך', dataIndex: 'order_date', render: formatDate },
    { title: 'שם לקוח', dataIndex: 'customer_name' },
    { title: 'איש קשר', dataIndex: 'contact_name' },
    { title: 'שעת התחלה', dataIndex: 'start_time', render: text => text?.slice(0, 5) || '' },
    { title: 'שעת סיום', dataIndex: 'end_time', render: text => text?.slice(0, 5) || '' },
    { title: 'כמות אוטובוסים', dataIndex: 'bus_quantity' },
    { title: 'חברה מבצעת', dataIndex: 'company_name', render: text => text || 'לא שובץ' },
    { title: 'סטטוס', dataIndex: 'tags', render: (_, record) => updateTags(record).join(', ') },
    { title: 'מחיר ליחידה', dataIndex: 'price_per_bus_customer' },
    { title: 'סה״כ שולם', dataIndex: 'total_paid_customer' },
  ];

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
      responsive: ["sm"],
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
      title: "תגיות",
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

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableFilters(filters);
  };

  return (
    <div>
      {tableType === "past" && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center', 
          marginBottom: '20px',
          padding: '10px'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}>
            <h1 style={{ 
              margin: 0,
              fontSize: '24px',
              fontFamily: 'Rubik, sans-serif',
              fontWeight: '500'
            }}>{`הזמנות חודש ${month}/${year}`}</h1>
            
            <ChooseYearAndMonth
              year={year}
              month={month}
              setYear={setYear}
              setMonth={setMonth}
            />
          </div>
        </div>
      )}
      
      <div style={{ 
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Input.Search
          placeholder="חיפוש..."
          allowClear
          enterButton
          onSearch={(value) => setSearchText(value)}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        
        <ExportToExcel
          data={getFilteredData()}
          columns={exportColumns}
          fileName={`הזמנות_${tableType}`}
          disabled={getFilteredData().length === 0}
          tableFilters={tableFilters}
        />
      </div>

      <ConfigProvider direction="rtl" locale={heIL}>
        <Table
          columns={columns}
          dataSource={getFilteredData().map((item) => ({
            ...item,
            key: item.order_id,
          }))}
          bordered={true}
          scroll={{ x: "max-content" }}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          expandable={{
            expandedRowRender: (record) => (
              <OrderDetails order={record} fetchOrders={fetchOrders} />
            ),
            expandedRowKeys,
            onExpandedRowsChange: (newExpandedRows) => {
              setExpandedRowKeys(newExpandedRows);
            },
          }}
          onRow={(record) => ({
            onClick: () => {
              const isExpanded = expandedRowKeys.includes(record.key);
              setExpandedRowKeys(isExpanded ? [] : [record.key]);
            },
            style: { cursor: "pointer" },
          })}
          onChange={handleTableChange}
        />
      </ConfigProvider>
    </div>
  );
}

export default OrderTable;
