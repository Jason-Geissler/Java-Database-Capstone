package com.project.back_end.DTO;

public class Login {

    // ------------------------
    // Fields
    // ------------------------
    private String identifier;  // Could be email (Doctor/Patient) or username (Admin)
    private String password;

    // ------------------------
    // Constructors
    // ------------------------
    public Login() {
        // Default constructor
    }

    public Login(String identifier, String password) {
        this.identifier = identifier;
        this.password = password;
    }

    // ------------------------
    // Getters and Setters
    // ------------------------
    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
