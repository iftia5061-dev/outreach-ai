export const mockProspects = [
  { id: 1, name: "Capt. Marco Bellini", position: "Captain", company: "MV Serenity", yacht: "MV Serenity", email: "marco@mvserenity.com", phone: "+39 123 456 7890", whatsapp: "+39 123 456 7890", linkedin: "linkedin.com/in/marco", country: "Italy", status: "Talking", interest: "High", lastContact: "2 days ago", nextFollowup: "Tomorrow" },
  { id: 2, name: "James Whitfield", position: "Yacht Manager", company: "Yacht Mgr", yacht: "MY Horizon", email: "james@yachtmgr.com", phone: "+30 987 654 3210", whatsapp: "+30 987 654 3210", linkedin: "linkedin.com/in/james", country: "Greece", status: "Qualified", interest: "Very High", lastContact: "1 day ago", nextFollowup: "Today" },
  { id: 3, name: "Eng. Nikos P.", position: "Engineer", company: "SY Azure", yacht: "SY Azure", email: "nikos@syazure.com", phone: "+356 555 123 4567", whatsapp: "+356 555 123 4567", linkedin: "linkedin.com/in/nikos", country: "Malta", status: "New", interest: "Medium", lastContact: "5 days ago", nextFollowup: "In 3 days" },
  { id: 4, name: "Sophie Laurent", position: "Shipyard Manager", company: "Shipyard Mgr", yacht: "—", email: "sophie@shipyard.com", phone: "+33 444 555 6666", whatsapp: "+33 444 555 6666", linkedin: "linkedin.com/in/sophie", country: "France", status: "New", interest: "Low", lastContact: "1 week ago", nextFollowup: "In 5 days" },
  { id: 5, name: "Capt. Ahmed Al-Rashid", position: "Captain", company: "MY Desert Rose", yacht: "MY Desert Rose", email: "ahmed@desertrose.com", phone: "+218 777 888 9999", whatsapp: "+218 777 888 9999", linkedin: "linkedin.com/in/ahmed", country: "Libya", status: "Talking", interest: "High", lastContact: "3 days ago", nextFollowup: "In 2 days" },
];

export const mockConversations = [
  { id: 1, name: "Capt. Marco Bellini", company: "MV Serenity", status: "Talking", lastMessage: "Yes we are interested in refit services...", time: "2m ago", unread: true, messages: [
    { id: 1, sender: "prospect", text: "Hello, I'm interested in your refit services", time: "10:00 AM" },
    { id: 2, sender: "ai", text: "Hello! Thank you for reaching out. We specialize in yacht refits across Greece, Malta, and Italy. What type of refit are you looking for?", time: "10:01 AM" },
    { id: 3, sender: "prospect", text: "We need hull repairs and engine overhaul", time: "10:05 AM" },
    { id: 4, sender: "ai", text: "Excellent! We can help with both. Our shipyard in Greece has excellent facilities for hull repairs. Would you like to schedule a consultation?", time: "10:06 AM" },
    { id: 5, sender: "prospect", text: "Yes we are interested in refit services...", time: "10:10 AM" },
  ]},
  { id: 2, name: "James Whitfield", company: "Yacht Mgr", status: "Qualified", lastMessage: "Can you send more details about Malta?", time: "15m ago", unread: true, messages: [
    { id: 1, sender: "prospect", text: "Hi, I manage a fleet of yachts", time: "9:30 AM" },
    { id: 2, sender: "ai", text: "Hello! We'd love to work with your fleet. We have multiple shipyard locations", time: "9:31 AM" },
    { id: 3, sender: "prospect", text: "Can you send more details about Malta?", time: "9:35 AM" },
  ]},
  { id: 3, name: "Eng. Nikos P.", company: "SY Azure", status: "New", lastMessage: "Thank you for reaching out...", time: "1h ago", unread: false, messages: [
    { id: 1, sender: "ai", text: "Hello! We offer yacht maintenance services", time: "8:00 AM" },
    { id: 2, sender: "prospect", text: "Thank you for reaching out...", time: "8:30 AM" },
  ]},
  { id: 4, name: "Sophie Laurent", company: "Shipyard Mgr", status: "New", lastMessage: "We have a yacht coming in for refit...", time: "3h ago", unread: false, messages: [
    { id: 1, sender: "prospect", text: "We have a yacht coming in for refit...", time: "6:00 AM" },
  ]},
  { id: 5, name: "Capt. Ahmed Al-Rashid", company: "MY Desert Rose", status: "Talking", lastMessage: "What are your rates for dry docking?", time: "5h ago", unread: false, messages: [
    { id: 1, sender: "prospect", text: "What are your rates for dry docking?", time: "4:00 AM" },
  ]},
];

export const mockCampaigns = [
  { id: 1, name: "Email Campaign - Greece", audience: "Yacht owners in Greece", channel: "Email", status: "Active", sent: 143, open: 89, reply: 34, conversion: "24%" },
  { id: 2, name: "WhatsApp Outreach - Malta", audience: "Shipyard managers in Malta", channel: "WhatsApp", status: "Active", sent: 89, open: 67, reply: 23, conversion: "26%" },
  { id: 3, name: "LinkedIn Pilot - Italy", audience: "Marine professionals in Italy", channel: "LinkedIn", status: "Paused", sent: 0, open: 0, reply: 0, conversion: "0%" },
];

export const mockMeetings = [
  { id: 1, name: "James Whitfield", company: "Yacht Mgr · Greece", date: "Sep 18, 2026", time: "10:00 AM", duration: "15 min", status: "Confirmed" },
  { id: 2, name: "Capt. Marco Bellini", company: "MV Serenity · Italy", date: "Sep 19, 2026", time: "2:00 PM", duration: "15 min", status: "Confirmed" },
  { id: 3, name: "Sophie Laurent", company: "Shipyard Mgr · France", date: "Sep 20, 2026", time: "11:00 AM", duration: "15 min", status: "Pending" },
  { id: 4, name: "Capt. Ahmed Al-Rashid", company: "MY Desert Rose · Libya", date: "Sep 22, 2026", time: "3:00 PM", duration: "15 min", status: "Pending" },
];

export const mockCalls = [
  { id: 1, phone: "+1 234 567 8900", caller: "John Smith", duration: "3:45", status: "Interested", result: "Meeting booked" },
  { id: 2, phone: "+1 987 654 3210", caller: "Jane Doe", duration: "2:30", status: "Qualified", result: "Follow-up scheduled" },
  { id: 3, phone: "+1 555 123 4567", caller: "Bob Johnson", duration: "5:12", status: "Not Interested", result: "Call ended" },
  { id: 4, phone: "+1 444 777 8888", caller: "Alice Brown", duration: "1:15", status: "Talking", result: "Call in progress" },
  { id: 5, phone: "+1 333 999 0000", caller: "Charlie Wilson", duration: "4:20", status: "Interested", result: "Meeting booked" },
];

export const mockStats = {
  totalProspects: 248,
  newLeads: 45,
  contacted: 89,
  responded: 67,
  interested: 34,
  qualified: 28,
  meetingsScheduled: 17,
  followupsPending: 23,
};
