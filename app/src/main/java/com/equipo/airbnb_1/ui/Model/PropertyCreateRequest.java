package com.equipo.airbnb_1.ui.Model;

import com.google.gson.annotations.SerializedName;

import java.util.Collections;
import java.util.List;

public class PropertyCreateRequest {

    @SerializedName("title")
    private final String title;

    @SerializedName("description")
    private final String description;

    @SerializedName("city")
    private final String city;

    @SerializedName("country")
    private final String country;

    @SerializedName("address")
    private final String address;

    @SerializedName("price_per_night")
    private final double pricePerNight;

    @SerializedName("guests")
    private final int guests;

    @SerializedName("bedrooms")
    private final int bedrooms;

    @SerializedName("bathrooms")
    private final double bathrooms;

    @SerializedName("type")
    private final String type;

    @SerializedName("amenities")
    private final List<String> amenities;

    @SerializedName("house_rules")
    private final List<String> houseRules;

    @SerializedName("booking_preference")
    private final String bookingPreference;

    @SerializedName("guest_preference")
    private final String guestPreference;

    @SerializedName("images")
    private final List<String> images;

    public PropertyCreateRequest(
            String title,
            String description,
            String city,
            String country,
            String address,
            double pricePerNight,
            int guests,
            int bedrooms,
            double bathrooms,
            String type,
            List<String> images
    ) {
        this.title = title;
        this.description = description;
        this.city = city;
        this.country = country;
        this.address = address;
        this.pricePerNight = pricePerNight;
        this.guests = guests;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.type = type;
        this.amenities = Collections.emptyList();
        this.houseRules = Collections.emptyList();
        this.bookingPreference = "approve_first";
        this.guestPreference = "any_guest";
        this.images = images;
    }
}