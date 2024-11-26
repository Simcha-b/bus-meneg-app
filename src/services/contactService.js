const API_URL = process.env.REACT_APP_API_URL;

export const getContacts = async () => {
  const response = await fetch(`${API_URL}/api/contacts`);
  const data = await response.json();
  return data;
};
export const getContactsByCustomerId = async (id) => {
  const response = await fetch(
    `${API_URL}/api/contacts/customer_id?customer_id=${id}`
  );
  const data = await response.json();
  return data;
};
