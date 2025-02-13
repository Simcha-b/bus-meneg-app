const API_URL = process.env.REACT_APP_API_URL;

export async function getCompanies() {

  const response = await fetch(`${API_URL}/api/companies`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify(companyData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add company');
  }
  
  return response.json();
};

export const deleteCompany = async (companyId) => {
  const response = await fetch(`${API_URL}/api/companies/${companyId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete company');
  }
  
  return true;
};
