## MySQL Database Design


### Table: patients

* id: INT, Primary Key, Auto Increment
* first_name: VARCHAR(50), Not Null
* last_name: VARCHAR(50), Not Null
* email: VARCHAR(100), Not Null, Unique
* password_hash: VARCHAR(255), Not Null
* phone: VARCHAR(20), Unique
* date_of_birth: DATE
* created_at: TIMESTAMP, Default CURRENT_TIMESTAMP

**Notes:**

* Email is unique and validated in application code.
* Patients should not be hard-deleted; use soft deletes if needed to preserve history.

### Table: doctors

* id: INT, Primary Key, Auto Increment
* first_name: VARCHAR(50), Not Null
* last_name: VARCHAR(50), Not Null
* specialization: VARCHAR(100), Not Null
* email: VARCHAR(100), Not Null, Unique
* phone: VARCHAR(20), Unique
* bio: TEXT
* is_active: BOOLEAN, Default TRUE
* created_at: TIMESTAMP, Default CURRENT_TIMESTAMP

**Notes:**

* Doctors should not be deleted if they have appointments; instead mark `is_active = false`.

### Table: admin

* id: INT, Primary Key, Auto Increment
* username: VARCHAR(50), Not Null, Unique
* password_hash: VARCHAR(255), Not Null
* email: VARCHAR(100), Unique
* created_at: TIMESTAMP, Default CURRENT_TIMESTAMP

### Table: appointments

* id: INT, Primary Key, Auto Increment
* doctor_id: INT, Foreign Key → doctors(id), Not Null
* patient_id: INT, Foreign Key → patients(id), Not Null
* appointment_start: DATETIME, Not Null
* appointment_end: DATETIME, Not Null
* status: INT, Not Null, Default 0

  * (0 = Scheduled, 1 = Completed, 2 = Cancelled, 3 = No-Show)
* created_at: TIMESTAMP, Default CURRENT_TIMESTAMP

**Constraints:**

* UNIQUE (doctor_id, appointment_start) → prevents overlapping bookings for the same doctor.
* ON DELETE RESTRICT for doctor_id → prevents deleting doctors with appointments.
* ON DELETE RESTRICT for patient_id → preserves medical history.

**Notes:**

* Past appointments should be retained permanently for legal and medical records.

### Table: clinic_locations

* id: INT, Primary Key, Auto Increment
* name: VARCHAR(100), Not Null
* address: VARCHAR(255), Not Null
* city: VARCHAR(100), Not Null
* state: VARCHAR(50), Not Null
* zip_code: VARCHAR(15), Not Null
* phone: VARCHAR(20)
* is_active: BOOLEAN, Default TRUE

### Table: doctor_locations

* id: INT, Primary Key, Auto Increment
* doctor_id: INT, Foreign Key → doctors(id), Not Null
* location_id: INT, Foreign Key → clinic_locations(id), Not Null

**Constraints:**

* UNIQUE (doctor_id, location_id) → prevents duplicate assignments.

**Notes:**

* Allows doctors to work at multiple clinics.

### Table: availability_slots

* id: INT, Primary Key, Auto Increment
* doctor_id: INT, Foreign Key → doctors(id), Not Null
* start_time: DATETIME, Not Null
* end_time: DATETIME, Not Null
* is_available: BOOLEAN, Default TRUE

**Constraints:**

* UNIQUE (doctor_id, start_time, end_time)

**Notes:**

* Doctors define available time slots here; appointments must fall within these ranges.

### Table: payments

* id: INT, Primary Key, Auto Increment
* appointment_id: INT, Foreign Key → appointments(id), Not Null, Unique
* patient_id: INT, Foreign Key → patients(id), Not Null
* amount: DECIMAL(10,2), Not Null
* payment_method: VARCHAR(50), Not Null
* status: VARCHAR(20), Not Null

  * ('Pending', 'Completed', 'Failed', 'Refunded')
* paid_at: DATETIME


### Table: prescriptions

* id: INT, Primary Key, Auto Increment
* appointment_id: INT, Foreign Key → appointments(id), Not Null
* doctor_id: INT, Foreign Key → doctors(id), Not Null
* patient_id: INT, Foreign Key → patients(id), Not Null
* medication_name: VARCHAR(100), Not Null
* dosage: VARCHAR(100), Not Null
* instructions: TEXT
* issued_at: TIMESTAMP, Default CURRENT_TIMESTAMP

**Notes:**

* Prescriptions are tied to a specific appointment for traceability.
* This aligns well with your MongoDB prescription model if you later store them there.


### Key Design Decisions (Justifications)

* **Patients are never hard-deleted:** Appointments and prescriptions must remain for compliance and history.
* **Doctors cannot have overlapping appointments:** Enforced via a unique constraint and availability slots.
* **Prescriptions are tied to appointments:** Ensures medical traceability and accountability.
* **Availability slots separate from appointments:** Enables proactive scheduling and prevents conflicts.


## MongoDB Collection Design

{
  "_id": "ObjectId('65fabc987654')",
  "appointmentId": 1023,
  "patientId": 87,
  "doctorId": 14,
  "patientSnapshot": {
    "firstName": "Emily",
    "lastName": "Carter",
    "age": 32,
    "email": "emily.carter@example.com"
  },
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "3 times a day",
      "duration": "7 days",
      "instructions": "Take after meals",
      "refillsRemaining": 1
    },
    {
      "name": "Ibuprofen",
      "dosage": "400mg",
      "frequency": "As needed",
      "maxDailyDose": "1200mg",
      "instructions": "Take with food"
    }
  ],
  "doctorNotes": "Patient shows signs of bacterial infection. Follow up in one week.",
  "tags": ["infection", "antibiotics", "follow-up"],
  "status": "active",
  "issuedAt": "2026-02-06T14:22:10Z",
  "lastUpdated": "2026-02-06T14:22:10Z",
  "pharmacy": {
    "name": "CVS Pharmacy",
    "location": "Downtown Clinic",
    "contact": "+1-555-123-4567"
  },
  "metadata": {
    "version": 1,
    "source": "doctor-portal",
    "audit": {
      "createdBy": "doctor_14",
      "updatedBy": null,
      "updateReason": null
    }
  }
}

