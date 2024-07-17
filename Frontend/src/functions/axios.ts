import Cookies from "js-cookie";
import axios from 'axios';

const getCookieToken = () => {
  const token = Cookies.get('token');
  return `Bearer ${token}`;
};

const axiosApiGateway = axios.create({
  baseURL: "http://localhost:4000",
});

axiosApiGateway.interceptors.request.use(
  (config) => {
    config.headers.Authorization = getCookieToken();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosApiGateway.interceptors.response.use(
  async (response) => {
    console.log("axios response", response);
    if (response.status === 204) {
      Cookies.remove('token');
      window.location.href = '/login';
    } else {
      return response;
    }
    console.log(response);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(error.config)
    alert(originalRequest)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        return axios.post('http://localhost:3000/auth/refresh-token', {
          refreshToken: refreshToken
        })
          .then((response) => {
            console.log(response);
            const newToken = response.data.accessToken;
            Cookies.set('token', newToken);
            return axiosApiGateway(originalRequest);
          })
          .catch((error) => {
            // If refresh token is also invalid, log out the user
            Cookies.remove('token');
            Cookies.remove('refreshToken');
            alert("hiiii")
            window.location.href = '/login';
            return Promise.reject(error);
          });
      } else {
        // If no refresh token, log out the user
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default axiosApiGateway;