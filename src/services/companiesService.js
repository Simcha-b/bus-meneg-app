const API_URL = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("token");

export async function getCompanies() {
  const response = await fetch(`${API_URL}/api/companies`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export const addCompany = async (companyData) => {
  const response = await fetch(`${API_URL}/api/companies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(companyData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add company');
  }
  
  return response.json();
};
