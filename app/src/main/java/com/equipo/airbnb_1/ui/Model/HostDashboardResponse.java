package com.equipo.airbnb_1.ui.Model;

import com.google.gson.annotations.SerializedName;

public class HostDashboardResponse {

    @SerializedName("total_properties")
    private int totalProperties;

    @SerializedName("total_bookings")
    private int totalBookings;

    @SerializedName("total_revenue")
    private double totalRevenue;

    @SerializedName("average_rating")
    private double averageRating;

    public int getTotalProperties() {
        return totalProperties;
    }

    public int getTotalBookings() {
        return totalBookings;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public double getAverageRating() {
        return averageRating;
    }
}