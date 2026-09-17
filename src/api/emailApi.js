// api/emailApi.js
import api from './axios';
import { MOCK_EMAILS } from '../features/email-inbox/api/emailsData';

export async function fetchEmails() {
  await api.get('/emails'); // simulated network round-trip
  return MOCK_EMAILS;
}

export async function markEmailRead(id) {
  return api.put(`/emails/${id}`, { unread: false });
}