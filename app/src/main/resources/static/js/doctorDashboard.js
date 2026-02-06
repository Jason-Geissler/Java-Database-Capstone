// appointmentsDashboard.js

// ------------------------
// Imports
// ------------------------
import { getAllAppointments } from "./services/appointmentRecordService.js";
import { createPatientRow } from "./components/patientRows.js";

// ------------------------
// Global Variables
// ------------------------
const tableBody = document.getElementById("patientTableBody");
let selectedDate = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
const token = localStorage.getItem("token");
let patientName = null;

// ------------------------
// Search Bar Functionality
// ------------------------
const searchBar = document.getElementById("searchBar");
if (searchBar) {
  searchBar.addEventListener("input", () => {
    const inputVal = searchBar.value.trim();
    patientName = inputVal !== "" ? inputVal : "null";
    loadAppointments();
  });
}

// ------------------------
// Filter Controls
// ------------------------

// "Today" button
const todayButton = document.getElementById("todayButton");
if (todayButton) {
  todayButton.addEventListener("click", () => {
    selectedDate = new Date().toISOString().split("T")[0];
    const datePicker = document.getElementById("datePicker");
    if (datePicker) datePicker.value = selectedDate;
    loadAppointments();
  });
}

// Date picker
const datePicker = document.getElementById("datePicker");
if (datePicker) {
  datePicker.addEventListener("change", () => {
    selectedDate = datePicker.value;
    loadAppointments();
  });
}

// ------------------------
// Function to Load Appointments
// ------------------------
export async function loadAppointments() {
  if (!tableBody) return;

  try {
    const appointments = await getAllAppointments(selectedDate, patientName, token);

    // Clear previous rows
    tableBody.innerHTML = "";

    if (!appointments || appointments.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 5; // adjust to match table columns
      cell.textContent = "No Appointments found for today.";
      row.appendChild(cell);
      tableBody.appendChild(row);
      return;
    }

    // Render each appointment
    appointments.forEach((appt) => {
      const patient = {
        id: appt.patientId,
        name: appt.patientName,
        phone: appt.patientPhone,
        email: appt.patientEmail,
      };
      const row = createPatientRow(appt, patient);
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading appointments:", error);
    tableBody.innerHTML = "";
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = "Error loading appointments. Try again later.";
    row.appendChild(cell);
    tableBody.appendChild(row);
  }
}

// ------------------------
// Initial Render on Page Load
// ------------------------
window.addEventListener("DOMContentLoaded", () => {
  if (typeof renderContent === "function") renderContent();
  loadAppointments();
});
