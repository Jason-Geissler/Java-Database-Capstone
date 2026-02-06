// js/services/index.js

// Import the openModal function to show login modals
import { openModal } from "../components/modals.js";

// Import the base API URL from the config
import { API_BASE_URL } from "../config/config.js";

// Define API endpoints
const ADMIN_API = API_BASE_URL + "/admin";
const DOCTOR_API = API_BASE_URL + "/doctor/login";

// Ensure DOM elements exist before attaching listeners
window.onload = function () {
  const adminBtn = document.getElementById("adminLogin");
  const doctorBtn = document.getElementById("doctorLogin");

  if (adminBtn) {
    adminBtn.addEventListener("click", () => openModal("adminLogin"));
  }

  if (doctorBtn) {
    doctorBtn.addEventListener("click", () => openModal("doctorLogin"));
  }
};

// Admin login handler
window.adminLoginHandler = async function () {
  try {
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;
    const admin = { username, password };

    const response = await fetch(ADMIN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(admin),
    });

    if (!response.ok) {
      alert("Invalid credentials!");
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    selectRole("admin");
  } catch (err) {
    console.error(err);
    alert("An error occurred during login. Please try again.");
  }
};

// Doctor login handler
window.doctorLoginHandler = async function () {
  try {
    const email = document.getElementById("doctorEmail").value;
    const password = document.getElementById("doctorPassword").value;
    const doctor = { email, password };

    const response = await fetch(DOCTOR_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctor),
    });

    if (!response.ok) {
      alert("Invalid credentials!");
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    selectRole("doctor");
  } catch (err) {
    console.error(err);
    alert("An error occurred during login. Please try again.");
  }
};
