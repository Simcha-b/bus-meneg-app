const API_URL = process.env.REACT_APP_API_URL;

export const getCustomers = async () => {
  const response = await fetch(`${API_URL}/api/customers`);
  if (!response.ok) {
    throw new Error(`Server error: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

export const getCustomerById = async (id) => {
  const response = await fetch(`${API_URL}/api/customer/:${id}`);
  return await response.json();
};
//function to add new customer to data base
export const addNewCustomer = async (newCustomer) => {
  console.log(JSON.stringify(newCustomer));
  
  const response = await fetch(`${API_URL}/api/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCustomer),
  });
  if (!response.ok) {
    throw new Error("Failed to add new customer");
  }
  const data = await response.json();
  return data;
};
//function to delete customer from data base
