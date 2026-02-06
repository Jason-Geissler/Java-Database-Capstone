package com.project.back_end.controllers;

import com.project.back_end.models.Admin;
import com.project.back_end.services.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("${api.path}admin")
public class AdminController {

    private final Service service;

    // Constructor injection for the Service dependency
    public AdminController(Service service) {
        this.service = service;
    }

    /**
     * Endpoint to handle admin login
     * @param admin The admin object containing username and password
     * @return ResponseEntity with login result (token or error message)
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> adminLogin(@RequestBody Admin admin) {
        // Delegate authentication to Service.validateAdmin
        return service.validateAdmin(admin);
    }
}
