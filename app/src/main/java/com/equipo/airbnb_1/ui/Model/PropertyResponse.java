package com.equipo.airbnb_1.ui.Model;

import com.google.gson.annotations.SerializedName;

public class PropertyResponse {
    @SerializedName("id")
    private int id;

    @SerializedName("titulo")
    private String titulo;

    @SerializedName("precio")
    private double precio;

    @SerializedName("imagen_url")
    private String imagenUrl;

    // Getters
    public int getId() { return id; }
    public String getTitulo() { return titulo; }
    public double getPrecio() { return precio; }
    public String getImagenUrl() { return imagenUrl; }
}