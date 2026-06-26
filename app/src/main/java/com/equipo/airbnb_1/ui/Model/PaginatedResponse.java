package com.equipo.airbnb_1.ui.Model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class PaginatedResponse<T> {

    @SerializedName("data")
    private List<T> data;

    public List<T> getData() {
        return data;
    }
}
