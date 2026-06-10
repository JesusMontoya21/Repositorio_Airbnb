package com.equipo.airbnb_1.ui.Model;

import com.google.gson.annotations.SerializedName;

public class Alojamiento {

    @SerializedName("id")
    private int id;

    @SerializedName("titulo")
    private String titulo;

    @SerializedName("precio")
    private double precio;

    @SerializedName("imagen_url")
    private String imagenUrl;

    public Alojamiento(int id, String titulo, double precio, String imagenUrl) {
        this.id = id;
        this.titulo = titulo;
        this.precio = precio;
        this.imagenUrl = imagenUrl;
    }

    // Getters
    public int getId() { return id; }
    public String getTitulo() { return titulo; }
    public double getPrecio() { return precio; }
    public String getImagenUrl() { return imagenUrl; }
}