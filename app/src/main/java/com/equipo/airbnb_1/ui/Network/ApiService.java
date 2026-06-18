package com.equipo.airbnb_1.ui.Network;

import com.equipo.airbnb_1.ui.Model.BookingRequest;
import com.equipo.airbnb_1.ui.Model.BookingResponse;
import com.equipo.airbnb_1.ui.Model.LoginRequest;
import com.equipo.airbnb_1.ui.Model.LoginResponse;
import com.equipo.airbnb_1.ui.Model.PropertyDetalleResponse;
import com.equipo.airbnb_1.ui.Model.RegisterRequest;
import com.equipo.airbnb_1.ui.Model.Alojamiento;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.GET;
import retrofit2.http.PUT;
import retrofit2.http.Path;

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

    @GET("properties/{id}")
    Call<PropertyDetalleResponse> obtenerDetalleAlojamiento(@Path("id") int id);

    @Headers({
            "Accept: application/json",
            "Content-Type: application/json"
    })
    @POST("bookings")
    Call<Void> crearReservacion(
            @Header("Authorization") String token,
            @Body BookingRequest request
    );

    @Headers({
            "Accept: application/json"
    })
    @GET("my-bookings")
    Call<List<BookingResponse>> obtenerMisViajes(
            @Header("Authorization") String token
    );

    @FormUrlEncoded
    @POST("api/reservaciones/{id}/estado")
    Call<Void> actualizarEstadoReserva(
            @Header("Authorization") String token,
            @Path("id") int reservacionId,
            @Field("status") String nuevoEstado
    );

    @Headers({
            "Accept: application/json"
    })
    @PUT("bookings/{id}/cancel")
    Call<Void> cancelarReserva(
            @Header("Authorization") String token,
            @Path("id") int reservacionId
    );

    @Headers({
            "Accept: application/json"
    })
    @PUT("bookings/{id}/confirm")
    Call<Void> confirmarReserva(
            @Header("Authorization") String token,
            @Path("id") int reservacionId
    );
}