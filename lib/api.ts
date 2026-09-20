const API_URL = 'http://localhost:5000/api';

// Auth
export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const registerUser = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

// Prospects
export const getProspects = async () => {
  const res = await fetch(`${API_URL}/prospects`);
  return res.json();
};

export const createProspect = async (data: any) => {
  const res = await fetch(`${API_URL}/prospects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateProspect = async (id: number, data: any) => {
  const res = await fetch(`${API_URL}/prospects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteProspect = async (id: number) => {
  const res = await fetch(`${API_URL}/prospects/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};

// Leads
export const getLeads = async () => {
  const res = await fetch(`${API_URL}/leads`);
  return res.json();
};

export const createLead = async (data: any) => {
  const res = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Meetings
export const getMeetings = async () => {
  const res = await fetch(`${API_URL}/meetings`);
  return res.json();
};

export const createMeeting = async (data: any) => {
  const res = await fetch(`${API_URL}/meetings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Campaigns
export const getCampaigns = async () => {
  const res = await fetch(`${API_URL}/campaigns`);
  return res.json();
};

export const createCampaign = async (data: any) => {
  const res = await fetch(`${API_URL}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};