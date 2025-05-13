import axios from 'axios';

export const api_base_url = process.env.NEXT_PUBLIC_API

export const apiClient = axios.create({
  baseURL: api_base_url,
})
