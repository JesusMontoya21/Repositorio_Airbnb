package com.equipo.airbnb_1.ui.Model;

public class LoginResponse {
    private String access_token;
    private String token_type;
    private String message; // Por si hay error

    public String getAccessToken() { return access_token; }
    public String getMessage() { return message; }
}
