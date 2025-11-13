package com.equipo.airbnb_1.ui.View;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.view.MenuItem;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.equipo.airbnb_1.R;
import com.equipo.airbnb_1.ui.Components.CarruselAdapter;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;

import java.util.ArrayList;

public class Alojamientos extends AppCompatActivity {

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

        seleccionInferior();
        seleccionarSeccion("Alojamientos");

        btnAlojamientos.setOnClickListener(v -> seleccionarSeccion("Alojamientos"));
        btnExperiencias.setOnClickListener(v -> {
            Intent intent = new Intent(Alojamientos.this, Experiencias.class);
            startActivity(intent);
        });
        btnServicios.setOnClickListener(v -> {
            Intent intent = new Intent(Alojamientos.this, Servicios.class);
            startActivity(intent);
        });

    }

    private void seleccionarSeccion(String seccion) {
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

        ArrayList<Integer> imagenes = new ArrayList<>();

        imagenes.add(R.drawable.casa1);
        imagenes.add(R.drawable.casa2);
        imagenes.add(R.drawable.casa3);

        CarruselAdapter adapter = new CarruselAdapter(imagenes, this);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
        recyclerCarrusel.setLayoutManager(layoutManager);
        recyclerCarrusel.setAdapter(adapter);
    }

    private void seleccionInferior() {
        BottomNavigationView bottomNavigationView = findViewById(R.id.bottom_navigation);

        bottomNavigationView.setOnItemSelectedListener(new NavigationBarView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {

                int id = item.getItemId();

                if (id == R.id.nav_navegacion) {
                    startActivity(new Intent(getApplicationContext(), Alojamientos.class));
                    return true;
                } else if (id == R.id.nav_favoritos) {
                    startActivity(new Intent(getApplicationContext(), Favoritos.class));
                    return true;
                } else if (id == R.id.nav_viajes) {
                    startActivity(new Intent(getApplicationContext(), Viajes.class));
                    return true;
                } else if (id == R.id.nav_mensajes) {
                    startActivity(new Intent(getApplicationContext(), Mensajes.class));
                    return true;
                } else if (id == R.id.nav_perfil) {
                    startActivity(new Intent(getApplicationContext(), Perfil.class));
                    return true;
                }

                return false;
            }
        });
    }

}

