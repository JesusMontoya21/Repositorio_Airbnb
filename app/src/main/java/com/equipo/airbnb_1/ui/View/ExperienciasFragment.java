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
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.equipo.airbnb_1.R;
import com.equipo.airbnb_1.ui.Components.CarruselAdapter;

import java.util.ArrayList;

public class ExperienciasFragment extends Fragment {

    private TextView btnAlojamientos, btnExperiencias, btnServicios;
    private RecyclerView recyclerCarrusel;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_home, container, false);
        View header = view.findViewById(R.id.header_home);

        btnAlojamientos = header.findViewById(R.id.btnAlojamientos);
        btnExperiencias = header.findViewById(R.id.btnExperiencias);
        btnServicios = header.findViewById(R.id.btnServicios);
        recyclerCarrusel = view.findViewById(R.id.recyclerCarrusel);

        seleccionarSeccion("Experiencias");

        btnExperiencias.setOnClickListener(v -> seleccionarSeccion("Experiencias"));

        btnAlojamientos.setOnClickListener(v -> {
            Navigation.findNavController(v).navigate(R.id.nav_navegacion);
        });

        btnServicios.setOnClickListener(v -> {
            Navigation.findNavController(v).navigate(R.id.btnServicios);
        });

        return view;
    }

    private void seleccionarSeccion(String seccion) {
        int colorRosa = Color.parseColor("#FF385C");
        int colorGrisMutado = Color.parseColor("#888888");

        btnAlojamientos.setBackgroundResource(R.drawable.bg_chip_inactive);
        btnAlojamientos.setTextColor(colorGrisMutado);

        btnExperiencias.setBackgroundResource(R.drawable.bg_chip_inactive);
        btnExperiencias.setTextColor(colorGrisMutado);

        btnServicios.setBackgroundResource(R.drawable.bg_chip_inactive);
        btnServicios.setTextColor(colorGrisMutado);

        switch (seccion) {
            case "Alojamientos":
                btnAlojamientos.setBackgroundResource(R.drawable.bg_chip_active);
                btnAlojamientos.setTextColor(colorRosa);
                break;
            case "Experiencias":
                btnExperiencias.setBackgroundResource(R.drawable.bg_chip_active);
                btnExperiencias.setTextColor(colorRosa);
                break;
            case "Servicios":
                btnServicios.setBackgroundResource(R.drawable.bg_chip_active);
                btnServicios.setTextColor(colorRosa);
                break;
        }

        // CORREGIDO: Cambiado de Integer a String para jalar URLs reales
        ArrayList<String> imagenes = new ArrayList<>();

        // Imágenes de prueba enfocadas a tours, caminatas y experiencias de viaje
        imagenes.add("https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=700");
        imagenes.add("https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=700");
        imagenes.add("https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=700");

        // El adaptador ahora recibe los textos de manera fluida y limpia
        CarruselAdapter adapter = new CarruselAdapter(imagenes, getContext());
        recyclerCarrusel.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        recyclerCarrusel.setAdapter(adapter);
    }
}