package com.equipo.airbnb_1.ui.View;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.equipo.airbnb_1.R;

public class Perfil extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_perfil);

        seleccionInferior();
    }

    private void seleccionInferior() {
        BottomNavigationView bottomNavigationView = findViewById(R.id.bottom_navigation);

        bottomNavigationView.setSelectedItemId(R.id.nav_perfil);

        bottomNavigationView.setOnItemSelectedListener(item -> {
            int id = item.getItemId();

            if (id == R.id.nav_navegacion) {
                startActivity(new Intent(this, Alojamientos.class));
                overridePendingTransition(0, 0);
                return true;
            } else if (id == R.id.nav_favoritos) {
                startActivity(new Intent(this, Favoritos.class));
                overridePendingTransition(0, 0);
                return true;
            } else if (id == R.id.nav_viajes) {
                startActivity(new Intent(this, Viajes.class));
                overridePendingTransition(0, 0);
                return true;
            } else if (id == R.id.nav_mensajes) {
                startActivity(new Intent(this, Mensajes.class));
                overridePendingTransition(0, 0);
                return true;
            } else if (id == R.id.nav_perfil) {
                return true;
            }

            return false;
        });
    }
}

