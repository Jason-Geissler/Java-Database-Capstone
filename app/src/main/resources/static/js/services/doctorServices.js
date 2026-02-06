// js/services/doctorServices.js

// Import API base URL from config
import { API_BASE_URL } from "../config/config.js";

// Define Doctor base API endpoint
const DOCTOR_API = API_BASE_URL + "/doctor";

/**
 * Fetch all doctors
 * @returns {Promise<Array>} Array of doctor objects
 */
export async function getDoctors() {
  try {
    const response = await fetch(DOCTOR_API);
    const data = await response.json();
    return data.doctors || [];
  } catch (err) {
    console.error("Error fetching doctors:", err);
    return [];
  }
}

/**
 * Delete a doctor by ID
 * @param {string} id - Doctor ID
 * @param {string} token - Admin authentication token
 * @returns {Promise<Object>} { success: boolean, message: string }
 */
export async function deleteDoctor(id, token) {
  try {
    const url = `${DOCTOR_API}/${id}/${token}`;
    const response = await fetch(url, { method: "DELETE" });
    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || "Doctor deleted successfully",
    };
  } catch (err) {
    console.error("Error deleting doctor:", err);
    return { success: false, message: "Failed to delete doctor" };
  }
}

/**
 * Save (create) a new doctor
 * @param {Object} doctor - Doctor data
 * @param {string} token - Admin authentication token
 * @returns {Promise<Object>} { success: boolean, message: string }
 */
export async function saveDoctor(doctor, token) {
  try {
    const url = `${DOCTOR_API}/${token}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctor),
    });
    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || "Doctor saved successfully",
    };
  } catch (err) {
    console.error("Error saving doctor:", err);
    return { success: false, message: "Failed to save doctor" };
  }
}

/**
 * Fetch filtered doctors based on name, time, and specialty
 * @param {string} name - Doctor name filter
 * @param {string} time - Time filter (AM/PM)
 * @param {string} specialty - Specialty filter
 * @returns {Promise<Object>} { doctors: Array }
 */
export async function filterDoctors(name = "", time = "", specialty = "") {
  try {
    const url = `${DOCTOR_API}/${name}/${time}/${specialty}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Error fetching filtered doctors:", response.statusText);
      return { doctors: [] };
    }
    const data = await response.json();
    return { doctors: data.doctors || [] };
  } catch (err) {
    console.error("Error filtering doctors:", err);
    alert("Failed to filter doctors. Please try again.");
    return { doctors: [] };
  }
}
