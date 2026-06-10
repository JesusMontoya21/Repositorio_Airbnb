package com.equipo.airbnb_1.ui.Network;

import com.equipo.airbnb_1.ui.Model.LoginRequest;
import com.equipo.airbnb_1.ui.Model.LoginResponse;
import com.equipo.airbnb_1.ui.Model.RegisterRequest;
import com.equipo.airbnb_1.ui.Model.Alojamiento;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.GET;

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
    Call<LoginResponse> registrarUsuario(@Body RegisterRequest registerRequest);

    @Headers({
            "Accept: application/json"
    })
    @GET("alojamientos")
    Call<List<Alojamiento>> getAlojamientos();
}