import axios from 'axios';

export const baseUrl = 'http://localhost:3001';

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'

  }
});

export const axiosAuthInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'

  }
});

axiosAuthInstance.interceptors.request.use(
  async (value) => {
    try {
      value.headers = {
        ...value.headers,
        Authorization: `Bearer ${JSON.parse(sessionStorage.userProfile).token}`
      };
    } catch (e) {
    }
    return value;
  },
  function (error) {
    return Promise.reject(error);
  }
);
