package com.equipo.airbnb_1.ui.Model;

import com.google.gson.annotations.SerializedName;

public class ImagenAlojamiento {

    @SerializedName("id")
    private int id;

    @SerializedName("property_id")
    private int propertyId;

    @SerializedName(value = "url", alternate = {"image_path", "ruta", "image", "imagen_url", "url_imagen"})
    private String url;

    public int getId() { return id; }
    public int getPropertyId() { return propertyId; }
    public String getUrl() { return url; }
}