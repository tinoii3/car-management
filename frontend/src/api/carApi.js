import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export async function getCars() {
  const response = await api.get('/cars');
  return response.data;
}

export async function createCar(car) {
  const response = await api.post('/cars', car);
  return response.data;
}

export async function updateCar(id, car) {
  const response = await api.put(`/cars/${id}`, car);
  return response.data;
}

export async function deleteCar(id) {
  await api.delete(`/cars/${id}`);
}

export function getErrorMessage(error) {
  return error.response?.data?.message || 'Something went wrong, please try again';
}
