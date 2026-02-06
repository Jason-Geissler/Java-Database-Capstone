package com.project.back_end.controllers;

import com.project.back_end.models.Prescription;
import com.project.back_end.services.PrescriptionService;
import com.project.back_end.services.Service;
import com.project.back_end.services.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("${api.path}prescription")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final Service service;
    private final AppointmentService appointmentService;

    // Constructor injection
    public PrescriptionController(PrescriptionService prescriptionService, Service service, AppointmentService appointmentService) {
        this.prescriptionService = prescriptionService;
        this.service = service;
        this.appointmentService = appointmentService;
    }

    /**
     * Save a new prescription
     */
    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> savePrescription(
            @PathVariable String token,
            @RequestBody Prescription prescription) {

        // Validate doctor token
        if (!service.validateToken(token, "doctor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or expired token"));
        }

        // Save prescription
        return prescriptionService.savePrescription(prescription);
    }

    /**
     * Get prescription by appointment ID
     */
    @GetMapping("/{appointmentId}/{token}")
    public ResponseEntity<Map<String, Object>> getPrescription(
            @PathVariable Long appointmentId,
            @PathVariable String token) {

        // Validate doctor token
        if (!service.validateToken(token, "doctor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or expired token"));
        }

        // Retrieve prescription
        return prescriptionService.getPrescription(appointmentId);
    }
}
