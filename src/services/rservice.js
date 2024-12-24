// services/authService.js
import axios from "axios";

const API_URL = "https://finance-system.koyeb.app/api/auth/register";  // Replace with your actual API endpoint

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    throw new Error("Registration failed");
  }
};
