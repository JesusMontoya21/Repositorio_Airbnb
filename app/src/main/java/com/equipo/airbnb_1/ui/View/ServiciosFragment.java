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

public class ServiciosFragment extends Fragment {

    private TextView btnAlojamientos, btnExperiencias, btnServicios;
    private RecyclerView recyclerCarrusel;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_home, container, false);
        View header = view.findViewById(R.id.header_home);

        if (header != null) {
            btnAlojamientos = header.findViewById(R.id.btnAlojamientos);
            btnExperiencias = header.findViewById(R.id.btnExperiencias);
            btnServicios = header.findViewById(R.id.btnServicios);
        }

        recyclerCarrusel = view.findViewById(R.id.recyclerCarrusel);

        seleccionarSeccion("Servicios");

        btnServicios.setOnClickListener(v -> seleccionarSeccion("Servicios"));

        btnExperiencias.setOnClickListener(v -> {
            Navigation.findNavController(v).navigate(R.id.btnExperiencias);
        });

        btnAlojamientos.setOnClickListener(v -> {
            Navigation.findNavController(v).navigate(R.id.nav_navegacion);
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

        // Imágenes de prueba enfocadas a servicios, albercas, spas y atención premium
        imagenes.add("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700");
        imagenes.add("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700");
        imagenes.add("https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700");

        CarruselAdapter adapter = new CarruselAdapter(imagenes, getContext());
        recyclerCarrusel.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        recyclerCarrusel.setAdapter(adapter);
    }
}