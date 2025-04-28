import axios from 'axios';

export const api_base_url = process.env.API
export const api_auth_base_url = process.env.API_AUTH

export const authClient = axios.create({
  baseURL: api_auth_base_url,
})
export const apiClient = axios.create({
  baseURL: api_base_url,
})
