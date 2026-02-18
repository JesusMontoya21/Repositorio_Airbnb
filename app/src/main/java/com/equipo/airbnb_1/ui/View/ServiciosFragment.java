package com.equipo.airbnb_1.ui.View;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment; // Cambio clave: de Activity a Fragment
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
        int colorNaranja = Color.parseColor("#FF6F61");
        int colorBlanco = Color.WHITE;

        btnAlojamientos.setBackgroundColor(colorBlanco);
        btnAlojamientos.setTextColor(colorNaranja);
        btnExperiencias.setBackgroundColor(colorBlanco);
        btnExperiencias.setTextColor(colorNaranja);
        btnServicios.setBackgroundColor(colorBlanco);
        btnServicios.setTextColor(colorNaranja);

        if (seccion.equals("Servicios")) {
            btnServicios.setBackgroundColor(colorNaranja);
            btnServicios.setTextColor(colorBlanco);
        }

        ArrayList<Integer> imagenes = new ArrayList<>();
        imagenes.add(R.drawable.casa1);
        imagenes.add(R.drawable.casa2);

        CarruselAdapter adapter = new CarruselAdapter(imagenes, getContext());
        recyclerCarrusel.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        recyclerCarrusel.setAdapter(adapter);
    }
}
