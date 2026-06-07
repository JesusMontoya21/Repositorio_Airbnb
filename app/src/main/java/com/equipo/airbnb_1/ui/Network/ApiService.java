package com.equipo.airbnb_1.ui.Network;

import com.equipo.airbnb_1.ui.Model.LoginRequest;
import com.equipo.airbnb_1.ui.Model.LoginResponse;
import com.equipo.airbnb_1.ui.Model.RegisterRequest;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Headers;
import retrofit2.http.POST;

public interface ApiService {

    @Headers({
            "Accept: application/json",
            "Content-Type: application/json"
    })
    @POST("login")
    Call<LoginResponse> login(@Body LoginRequest loginRequest);

    @Headers({
            "Accept: application/json",
            "Content-Type: application/json"
    })
    @POST("register")
        // CAMBIADO: De Call<Void> a Call<LoginResponse> porque Laravel devuelve el token y el usuario en el registro
    Call<LoginResponse> registrarUsuario(@Body RegisterRequest registerRequest);
}