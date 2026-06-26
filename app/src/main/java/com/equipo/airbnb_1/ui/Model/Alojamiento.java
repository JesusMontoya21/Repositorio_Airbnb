package com.equipo.airbnb_1.ui.Model;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class Alojamiento {

    @SerializedName("id")
    private int id;

    @SerializedName(value = "title", alternate = {"titulo", "name"})
    private String titulo;

    @SerializedName(value = "precio", alternate = {"price", "total_price"})
    private double precio;

    @SerializedName(value = "images", alternate = {"imagenes"})
    private List<ImagenAlojamiento> images;

    public Alojamiento(int id, String titulo, double precio, List<ImagenAlojamiento> images) {
        this.id = id;
        this.titulo = titulo;
        this.precio = precio;
        this.images = images;
    }

    // Getters
    public int getId() { return id; }
    public String getTitulo() { return titulo; }
    public double getPrecio() { return precio; }
    public List<ImagenAlojamiento> getImages() { return images; }
}
