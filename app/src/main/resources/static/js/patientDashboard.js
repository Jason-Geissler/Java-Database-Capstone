// patientDashboard.js

// ------------------------
// Imports
// ------------------------
import { createDoctorCard } from './components/doctorCard.js';
import { openModal } from './components/modals.js';
import { getDoctors, filterDoctors } from './services/doctorServices.js';
import { patientSignup, patientLogin } from './services/patientServices.js';

// ------------------------
// Load Doctor Cards on Page Load
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();
});

// ------------------------
// Modal Triggers
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("patientSignup");
  if (signupBtn) signupBtn.addEventListener("click", () => openModal("patientSignup"));

  const loginBtn = document.getElementById("patientLogin");
  if (loginBtn) loginBtn.addEventListener("click", () => openModal("patientLogin"));
});

// ------------------------
// Load All Doctors
// ------------------------
async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Failed to load doctors:", error);
  }
}

// ------------------------
// Search & Filter Event Listeners
// ------------------------
const searchBar = document.getElementById("searchBar");
const filterTime = document.getElementById("filterTime");
const filterSpecialty = document.getElementById("filterSpecialty");

if (searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);
if (filterTime) filterTime.addEventListener("change", filterDoctorsOnChange);
if (filterSpecialty) filterSpecialty.addEventListener("change", filterDoctorsOnChange);

// ------------------------
// Filter Doctors Function
// ------------------------
async function filterDoctorsOnChange() {
  const name = searchBar.value.trim() || null;
  const time = filterTime.value || null;
  const specialty = filterSpecialty.value || null;

  try {
    const response = await filterDoctors(name, time, specialty);
    const doctors = response.doctors || [];
    if (doctors.length > 0) {
      renderDoctorCards(doctors);
    } else {
      document.getElementById("content").innerHTML = "<p>No doctors found with the given filters.</p>";
    }
  } catch (error) {
    console.error("Failed to filter doctors:", error);
    alert("❌ An error occurred while filtering doctors.");
  }
}

// ------------------------
// Render Utility Function
// ------------------------
function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById("content");
  if (!contentDiv) return;

  contentDiv.innerHTML = "";
  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

// ------------------------
// Patient Signup
// ------------------------
window.signupPatient = async function () {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    const data = { name, email, password, phone, address };
    const { success, message } = await patientSignup(data);

    if (success) {
      alert(message);
      document.getElementById("modal").style.display = "none";
      window.location.reload();
    } else {
      alert(message);
    }
  } catch (error) {
    console.error("Signup failed:", error);
    alert("❌ An error occurred while signing up.");
  }
};

// ------------------------
// Patient Login
// ------------------------
window.loginPatient = async function () {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = { email, password };
    const response = await patientLogin(data);

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem('token', result.token);
      selectRole('loggedPatient');
      window.location.href = '/pages/loggedPatientDashboard.html';
    } else {
      alert('❌ Invalid credentials!');
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("❌ Failed to Login.");
  }
};
