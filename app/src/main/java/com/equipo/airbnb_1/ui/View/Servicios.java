package com.equipo.airbnb_1.ui.View;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.equipo.airbnb_1.R;
import com.equipo.airbnb_1.ui.Components.CarruselAdapter;

import java.util.ArrayList;

public class Servicios extends AppCompatActivity {

    TextView btnAlojamientos, btnExperiencias, btnServicios;
    RecyclerView recyclerCarrusel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        btnAlojamientos = findViewById(R.id.btnAlojamientos);
        btnExperiencias = findViewById(R.id.btnExperiencias);
        btnServicios = findViewById(R.id.btnServicios);
        recyclerCarrusel = findViewById(R.id.recyclerCarrusel);

        seleccionarSeccion("Servicios");

        btnAlojamientos.setOnClickListener(v -> {
            Intent intent = new Intent(Servicios.this, Alojamientos.class);
            startActivity(intent);
        });
        btnExperiencias.setOnClickListener(v -> {
            Intent intent = new Intent(Servicios.this, Experiencias.class);
            startActivity(intent);
        });
        btnServicios.setOnClickListener(v -> {
            Intent intent = new Intent(Servicios.this, Servicios.class);
            startActivity(intent);
        });
    }

    private void seleccionarSeccion(String seccion) {
        // Cambiar colores de banner
        btnAlojamientos.setBackgroundColor(Color.WHITE);
        btnAlojamientos.setTextColor(Color.parseColor("#FF6F61"));

        btnExperiencias.setBackgroundColor(Color.WHITE);
        btnExperiencias.setTextColor(Color.parseColor("#FF6F61"));

        btnServicios.setBackgroundColor(Color.WHITE);
        btnServicios.setTextColor(Color.parseColor("#FF6F61"));

        switch (seccion) {
            case "Alojamientos":
                btnAlojamientos.setBackgroundColor(Color.parseColor("#FF6F61"));
                btnAlojamientos.setTextColor(Color.WHITE);
                break;
            case "Experiencias":
                btnExperiencias.setBackgroundColor(Color.parseColor("#FF6F61"));
                btnExperiencias.setTextColor(Color.WHITE);
                break;
            case "Servicios":
                btnServicios.setBackgroundColor(Color.parseColor("#FF6F61"));
                btnServicios.setTextColor(Color.WHITE);
                break;
        }

        // Configurar RecyclerView horizontal
        ArrayList<Integer> imagenes = new ArrayList<>();
        // Imágenes locales en res/drawable
        imagenes.add(R.drawable.casa1);
        imagenes.add(R.drawable.casa2);

        CarruselAdapter adapter = new CarruselAdapter(imagenes, this);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
        recyclerCarrusel.setLayoutManager(layoutManager);
        recyclerCarrusel.setAdapter(adapter);
    }
}
