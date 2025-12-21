import axios from "axios"
import cookieHelper from "helpers/getCookieData";

// const token = cookieHelper.getCookie("access_token");
// const API_URL = `${process.env.REACT_APP_API_URL}`
const API_URL = "http://localhost:4040/api"

const axiosApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  credentials: 'include'
})

// Avoid infinite loop
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If 401 and it's not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosApi(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = cookieHelper.getCookie('refresh_token');

      if (!refreshToken) {
        // Optional: Logout user
        return Promise.reject(error);
      }

      try {
        const { body } = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = body.access_token;

        cookieHelper.setCookie('access_token', newAccessToken, 1);
        axiosApi.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        processQueue(null, newAccessToken);

        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return axiosApi(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

// axiosApi.interceptors.request.use(config => {
//   const token = cookieHelper.getCookie("access_token");
  
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
  
//   return config;
// });

axiosApi.interceptors.request.use(config => {
  const token = cookieHelper.getCookie("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!config.params) config.params = {};

  const add = (k, v) => v != null && v !== '' && v != 'null' && (config.params[k] = v);

  add('client_id', localStorage.getItem('client'));
  add('clinic_id', localStorage.getItem('clinic'));

  return config;
});

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config }).then(response => response.data)
}

export async function post(url, data, config = {}) {
  const finalData = {...data}
  return axiosApi
    .post(url, { ...finalData }, { ...config })
    .then(response => response.data)
}

export async function uploadImg(url, data) {
  const requestOptions = {
    method: 'POST',
    body: data, // FormData object
    redirect: 'follow',
    withCredentials: true,
    credentials: 'include'
  };

  return fetch(`${API_URL}${url}`, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result));
}


export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
}
