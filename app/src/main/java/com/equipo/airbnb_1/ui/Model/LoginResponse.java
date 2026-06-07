package com.equipo.airbnb_1.ui.Model;

import com.google.gson.annotations.SerializedName;

public class LoginResponse {

    @SerializedName("message")
    private String message;

    @SerializedName("token")
    private String accessToken;

    @SerializedName("user")
    private Object user;

    public String getAccessToken() {
        return accessToken;
    }

    public String getMessage() {
        return message;
    }
}