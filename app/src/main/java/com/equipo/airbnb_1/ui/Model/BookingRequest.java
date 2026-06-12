package com.equipo.airbnb_1.ui.Model;

import com.google.gson.annotations.SerializedName;

public class BookingRequest {
    @SerializedName("property_id")
    private int propertyId;

    @SerializedName("check_in")
    private String checkIn;

    @SerializedName("check_out")
    private String checkOut;

    private int guests;

    @SerializedName("total_price")
    private double totalPrice;

    // Constructor
    public BookingRequest(int propertyId, String checkIn, String checkOut, int guests, double totalPrice) {
        this.propertyId = propertyId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.guests = guests;
        this.totalPrice = totalPrice;
    }
}