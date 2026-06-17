import axios from "axios";

// Base API for Next.js API routes (avoids CORS issues)
const API = axios.create({
  baseURL: "/api",
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45 second timeout
});

// Add request interceptor for debugging
API.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.baseURL + config.url);
    console.log('Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.statusText);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Cannot reach the server');
      console.error('- Check if backend server is running');
      console.error('- Check if URL is correct:', error.config?.baseURL);
      console.error('- Check for CORS issues');
    } else if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('No response received:', error.request);
      console.error('This usually means the server is not reachable');
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API Methods for Students
export const getStudents = () => API.get('/students');
export const getStudentById = (id) => API.get(`/students/${id}`);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// API Methods for Courses
export const getCourses = () => API.get('/courses');
export const getCourseById = (id) => API.get(`/courses/${id}`);
export const createCourse = (courseData) => API.post('/courses', courseData);
export const updateCourse = (id, courseData) => API.put(`/courses/${id}`, courseData);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// API Methods for Faculty
export const getFaculty = () => API.get('/faculty');
export const getFacultyById = (id) => API.get(`/faculty/${id}`);
export const createFaculty = (facultyData) => API.post('/faculty', facultyData);
export const updateFaculty = (id, facultyData) => API.put(`/faculty/${id}`, facultyData);
export const deleteFaculty = (id) => API.delete(`/faculty/${id}`);

// API Methods for Orders
export const getOrders = (params) => API.get('/orders', { params });
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const createOrder = (orderData) => API.post('/orders', orderData);
export const updateOrder = (id, orderData) => API.put(`/orders/${id}`, orderData);
export const deleteOrder = (id) => API.delete(`/orders/${id}`);

// API Methods for Categories
export const getCategories = () => API.get('/categories');
export const getCategoryById = (id) => API.get(`/categories/${id}`);
export const createCategory = (categoryData) => API.post('/categories', categoryData);
export const updateCategory = (id, categoryData) => API.put(`/categories/${id}`, categoryData);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export default API;