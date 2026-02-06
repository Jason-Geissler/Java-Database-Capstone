// patientServices.js

// Import API Base URL from config
import { API_BASE_URL } from "../config/config.js";

// Base endpoint for all patient-related actions
const PATIENT_API = API_BASE_URL + "/patient";

/**
 * Register a new patient
 * @param {Object} data - Patient details (name, email, password, etc.)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function patientSignup(data) {
  try {
    // Send POST request to create a new patient
    const response = await fetch(PATIENT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return { success: true, message: result.message };
  } catch (error) {
    console.error("Error :: patientSignup ::", error);
    return { success: false, message: error.message };
  }
}

/**
 * Patient login
 * @param {Object} data - Login credentials (email, password)
 * @returns {Promise<Response>} - Raw fetch response
 */
export async function patientLogin(data) {
  try {
    return await fetch(`${PATIENT_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error :: patientLogin ::", error);
    return null;
  }
}

/**
 * Fetch logged-in patient details using token
 * @param {string} token - Patient auth token
 * @returns {Promise<Object|null>} - Patient object or null on failure
 */
export async function getPatientData(token) {
  try {
    const response = await fetch(`${PATIENT_API}/${token}`);
    const data = await response.json();
    return response.ok ? data.patient : null;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return null;
  }
}

/**
 * Fetch patient appointments
 * Works for both patient and doctor dashboards based on user role
 * @param {string} id - Patient ID
 * @param {string} token - Auth token
 * @param {string} user - 'patient' or 'doctor'
 * @returns {Promise<Array|null>} - List of appointments
 */
export async function getPatientAppointments(id, token, user) {
  try {
    const response = await fetch(`${PATIENT_API}/${id}/${user}/${token}`);
    const data = await response.json();
    return response.ok ? data.appointments : null;
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    return null;
  }
}

/**
 * Filter patient appointments by condition and patient name
 * @param {string} condition - e.g., "pending", "consulted"
 * @param {string} name - Patient name to filter
 * @param {string} token - Auth token
 * @returns {Promise<{appointments: Array}>}
 */
export async function filterAppointments(condition, name, token) {
  try {
    const response = await fetch(`${PATIENT_API}/filter/${condition}/${name}/${token}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Failed to fetch appointments:", response.statusText);
      return { appointments: [] };
    }

    const data = await response.json();
    return { appointments: data.appointments || [] };
  } catch (error) {
    console.error("Error filtering appointments:", error);
    alert("Something went wrong while filtering appointments!");
    return { appointments: [] };
  }
}
