const API_URL = process.env.REACT_APP_API_URL;
const token = sessionStorage.getItem("token");
export const getContacts = async () => {
  const response = await fetch(`${API_URL}/api/contacts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};
export const getContactsByCustomerId = async (id) => {
  const response = await fetch(
    `${API_URL}/api/contacts/customer_id?customer_id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const insertContact = async (contact, id) => {
  const response = await fetch(
    `${API_URL}/api/contacts/?customer_id=${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contact),
    }
  );
  const data = await response.json();
  console.log(data);
  
  return data;
}