package com.project.back_end.mvc;

import com.project.back_end.services.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class DashboardController {

    private final TokenService tokenService;

    @Autowired
    public DashboardController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    /**
     * Handles the admin dashboard view.
     * Validates the token for the "admin" role.
     */
    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable String token) {
        if (tokenService.validateToken(token, "admin")) {
            return "admin/adminDashboard";  // returns the admin dashboard view
        }
        return "redirect:/"; // redirect to home/login if invalid
    }

    /**
     * Handles the doctor dashboard view.
     * Validates the token for the "doctor" role.
     */
    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable String token) {
        if (tokenService.validateToken(token, "doctor")) {
            return "doctor/doctorDashboard";  // returns the doctor dashboard view
        }
        return "redirect:/"; // redirect to home/login if invalid
    }
}

