import { fetch } from "frontity";

const apiFetch = (url, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem("jwt_token") : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });
};

export default apiFetch;