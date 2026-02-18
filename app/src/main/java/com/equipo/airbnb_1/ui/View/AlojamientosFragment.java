package com.equipo.airbnb_1.ui.View;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation; // IMPORTANTE: Para navegar entre fragmentos
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.equipo.airbnb_1.R;
import com.equipo.airbnb_1.ui.Components.CarruselAdapter;

import java.util.ArrayList;

public class AlojamientosFragment extends Fragment {

    TextView btnAlojamientos, btnExperiencias, btnServicios;
    RecyclerView recyclerCarrusel;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.activity_home, container, false);
        View header = view.findViewById(R.id.header_home);

        btnAlojamientos = header.findViewById(R.id.btnAlojamientos);
        btnExperiencias = header.findViewById(R.id.btnExperiencias);
        btnServicios = header.findViewById(R.id.btnServicios);
        recyclerCarrusel = view.findViewById(R.id.recyclerCarrusel);

        seleccionarSeccion("Alojamientos");

        // --- BOTONES DE NAVEGACIÓN CORREGIDOS ---

        btnAlojamientos.setOnClickListener(v -> seleccionarSeccion("Alojamientos"));
        btnExperiencias.setOnClickListener(v -> {
            Navigation.findNavController(v).navigate(R.id.btnExperiencias);
        });
        btnServicios.setOnClickListener(v -> {
            Navigation.findNavController(v).navigate(R.id.btnServicios);
        });

        return view;
    }

    private void seleccionarSeccion(String seccion) {
        int colorNaranja = Color.parseColor("#FF6F61");
        int colorBlanco = Color.WHITE;

        btnAlojamientos.setBackgroundColor(colorBlanco);
        btnAlojamientos.setTextColor(colorNaranja);
        btnExperiencias.setBackgroundColor(colorBlanco);
        btnExperiencias.setTextColor(colorNaranja);
        btnServicios.setBackgroundColor(colorBlanco);
        btnServicios.setTextColor(colorNaranja);

        switch (seccion) {
            case "Alojamientos":
                btnAlojamientos.setBackgroundColor(colorNaranja);
                btnAlojamientos.setTextColor(colorBlanco);
                break;
            case "Experiencias":
                btnExperiencias.setBackgroundColor(colorNaranja);
                btnExperiencias.setTextColor(colorBlanco);
                break;
            case "Servicios":
                btnServicios.setBackgroundColor(colorNaranja);
                btnServicios.setTextColor(colorBlanco);
                break;
        }

        ArrayList<Integer> imagenes = new ArrayList<>();
        imagenes.add(R.drawable.casa1);
        imagenes.add(R.drawable.casa2);
        imagenes.add(R.drawable.casa3);

        CarruselAdapter adapter = new CarruselAdapter(imagenes, getContext());
        LinearLayoutManager layoutManager = new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false);
        recyclerCarrusel.setLayoutManager(layoutManager);
        recyclerCarrusel.setAdapter(adapter);
    }
}