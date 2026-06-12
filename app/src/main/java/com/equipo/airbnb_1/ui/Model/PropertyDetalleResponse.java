package com.equipo.airbnb_1.ui.Model;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class PropertyDetalleResponse {
    private int id;
    @SerializedName("title")
    private String titulo;
    @SerializedName("description")
    private String descripcion;
    @SerializedName("city")
    private String ciudad;
    @SerializedName("address")
    private String direccion;
    @SerializedName("price_per_night")
    private double precioPerNight;
    private int guests;
    private int bedrooms;
    private double bathrooms;


    private List<ImagenModel> images;
    private UsuarioModel user;


    public int getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getDescripcion() { return descripcion; }
    public String getCiudad() { return ciudad; }
    public String getDireccion() { return direccion; }
    public double getPrecioPerNight() { return precioPerNight; }
    public int getGuests() { return guests; }
    public int getBedrooms() { return bedrooms; }
    public double getBathrooms() { return bathrooms; }
    public List<ImagenModel> getImages() { return images; }
    public UsuarioModel getUser() { return user; }


    public static class ImagenModel {
        private String url;
        @SerializedName("is_primary")
        private boolean isPrimary;
        public String getUrl() { return url; }
        public boolean isPrimary() { return isPrimary; }
    }

    public static class UsuarioModel {
        private String name;
        private String email;
        public String getName() { return name; }
        public String getEmail() { return email; }
    }
}