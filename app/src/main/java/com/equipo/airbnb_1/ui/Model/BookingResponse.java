package com.equipo.airbnb_1.ui.Model;

import com.google.gson.annotations.SerializedName;

public class BookingResponse {
    private int id;

    @SerializedName("check_in")
    private String checkIn;

    @SerializedName("check_out")
    private String checkOut;

    private int guests;

    @SerializedName("total_price")
    private double totalPrice;

    private String status;
    @SerializedName("property")
    private Alojamiento property;

    // Getters
    public int getId() { return id; }
    public String getCheckIn() { return checkIn; }
    public String getCheckOut() { return checkOut; }
    public int getGuests() { return guests; }
    public double getTotalPrice() { return totalPrice; }
    public String getStatus() { return status; }
    public Alojamiento getProperty() { return property; }
}