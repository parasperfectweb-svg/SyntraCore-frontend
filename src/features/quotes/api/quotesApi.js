// features/quotes/api/quotesApi.js
import api from '../../../api/axios';

export async function saveDraftQuote(formState) {
  return api.post('/quotes/draft', formState);
}

export async function generateQuote(formState) {
  return api.post('/quotes/generate', formState);
}