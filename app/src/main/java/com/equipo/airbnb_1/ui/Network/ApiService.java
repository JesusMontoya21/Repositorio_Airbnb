package com.equipo.airbnb_1.ui.Network;

import com.equipo.airbnb_1.ui.Model.LoginRequest;
import com.equipo.airbnb_1.ui.Model.LoginResponse;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;


public interface ApiService {
    @POST("auth/login")
    Call<LoginResponse> Login(@Body LoginRequest request);
}
