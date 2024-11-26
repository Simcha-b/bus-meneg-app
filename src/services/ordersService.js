const API_URL = process.env.REACT_APP_API_URL;

export const getOrders = async () => {
  const response = await fetch(`${API_URL}/api/orders`);
  console.log(API_URL);
  
  const data = await response.json();
  return data;
};
//get orders future
export const getFutureOrders = async () => {
  const response = await fetch(`${API_URL}/api/orders/future`);
  const data = await response.json();
  return data;
};
// get orders by date
export const getOrdersByDate = async (year, month) => {
  try {
    const url = `${API_URL}/api/orders/byDate?year=${year}&month=${month}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Fetch error:", error);
    throw error;
  }
};

//get order by id
export const getOrderById = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/api/orders/${orderId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Fetch error:", error);
    throw error;
  }
};

//get orders by Customer Id
export const getOrdersByCustomerId = async (id) => {
  const response = await fetch(`${API_URL}/api/orders/customer/${id}`);
  const data = await response.json();
  return data;
};

//get orders by Company Id
export const getOrdersByCompanyId = async (id) => {
  const response = await fetch(`${API_URL}/api/orders/company/${id}`);
  const data = await response.json();
  return data;
};

export const sendNewOrder = async (body) => {
  console.log(body);

  const response = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export const updateOrder = async (id, body) => {
  const response = await fetch(`${API_URL}/api/orders/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export async function updateOrderStatus(id, status) {
  const response = await fetch(`${API_URL}/api/orders/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error("Failed to update order status");
  }
}

export const deleteOrder = async (id) => {
  const response = await fetch(`${API_URL}/api/orders/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const formatDate = (date) => {
  const formattedDate = new Date(date).toLocaleDateString("he-IL");
  return formattedDate;
};
