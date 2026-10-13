// Helper to safely parse JSON response
const safeJsonParse = async (res: Response) => {
  // Handle 401 Unauthorized
  if (res.status === 401) {
    localStorage.removeItem('token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login?expired=true';
    }
    return { error: 'Session expired, please log in again' };
  }

  // Handle 429 Too Many Requests - no retry
  if (res.status === 429) {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      return { error: data.error || 'Too many requests, please wait' };
    }
    return { error: 'Too many requests, please wait' };
  }

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    // If not JSON, return error object
    return { error: text || 'Unknown error' };
  }
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;

// Auth
export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const register = async (email: string, password: string, name: string) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const logout = async () => {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const googleLoginUser = async (idToken: string) => {
  const res = await fetch(`${API_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

// Prospects
export const getProspects = async () => {
  const res = await fetch(`${API_URL}/prospects`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const createProspect = async (data: any) => {
  const res = await fetch(`${API_URL}/prospects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const updateProspect = async (id: number, data: any) => {
  const res = await fetch(`${API_URL}/prospects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const deleteProspect = async (id: number) => {
  const res = await fetch(`${API_URL}/prospects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const grantConsent = async (data: any) => {
  const res = await fetch(`${API_URL}/consents/grant`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const revokeConsent = async (data: any) => {
  const res = await fetch(`${API_URL}/consents/revoke`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

// Leads
export const getLeads = async () => {
  const res = await fetch(`${API_URL}/leads`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const createLead = async (data: any) => {
  const res = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

// Meetings
export const getMeetings = async () => {
  const res = await fetch(`${API_URL}/meetings`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const createMeeting = async (data: any) => {
  const res = await fetch(`${API_URL}/meetings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const updateMeeting = async (id: number, data: any) => {
  const res = await fetch(`${API_URL}/meetings/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const deleteMeeting = async (id: number) => {
  const res = await fetch(`${API_URL}/meetings/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

// Campaigns
export const getCampaigns = async () => {
  const res = await fetch(`${API_URL}/campaigns`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const createCampaign = async (data: any) => {
  const res = await fetch(`${API_URL}/campaigns`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const updateCampaign = async (id: number, data: any) => {
  const res = await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const deleteCampaign = async (id: number) => {
  const res = await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

// Consent
export const getConsents = async () => {
  const res = await fetch(`${API_URL}/consents`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

// Outreach
export const createBookingLink = async (data: any) => {
  const res = await fetch(`${API_URL}/outreach/booking-link`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

// AI Chat
export const aiGenerateEmail = async (data: any) => {
  const res = await fetch(`${API_URL}/ai/generate-email`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const aiGenerateReply = async (conversation_history: string, company_info: string, prospect_name: string, sender_name: string) => {
  const res = await fetch(`${API_URL}/ai/generate-reply`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ conversation_history, company_info, prospect_name, sender_name }),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const aiSendEmail = async (to: string, subject: string, body: string, prospect_id: number) => {
  const res = await fetch(`${API_URL}/ai/send-email`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ to, subject, body, prospect_id }),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const aiChat = async (message: string, prospect: any, company_info: string) => {
  const res = await fetch(`${API_URL}/ai/chat`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ message, prospect, company_info }),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

// Sent Emails
export const getSentEmails = async (prospectId?: number) => {
  const url = prospectId
    ? `${API_URL}/email/sent?prospect_id=${prospectId}`
    : `${API_URL}/email/sent`;
  const res = await fetch(url, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

// AI Settings
export const getAISettings = async () => {
  const res = await fetch(`${API_URL}/ai/settings`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const updateAISettings = async (data: any) => {
  const res = await fetch(`${API_URL}/ai/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

// Subscription
export const getSubscriptionStatus = async () => {
  const res = await fetch(`${API_URL}/subscriptions/status`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const createCheckoutSession = async (data: any) => {
  const res = await fetch(`${API_URL}/subscriptions/checkout`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

export const createBillingPortal = async () => {
  const res = await fetch(`${API_URL}/subscriptions/portal`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return safeJsonParse(res);
};

// Analytics
export const getAnalytics = async () => {
  const res = await fetch(`${API_URL}/analytics`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return safeJsonParse(res);
};
