package com.equipo.airbnb_1.ui.Model;

import com.google.gson.annotations.SerializedName;

public class LoginResponse<User> {

    @SerializedName("message")
    private String message;

    @SerializedName("token")
    private String accessToken;

    @SerializedName("user")
    private User user;
    public User getUser() {return user; }

    public String getAccessToken() {
        return accessToken;
    }

    public String getMessage() {
        return message;
    }
}