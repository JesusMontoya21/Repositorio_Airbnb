package com.equipo.airbnb_1.ui.View;

import android.os.Bundle;
import android.view.View;
import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.NavOptions; // 🌟 IMPORTANTE: Añadido para controlar la limpieza de la pila
import androidx.navigation.fragment.NavHostFragment;
import androidx.navigation.ui.NavigationUI;
import com.equipo.airbnb_1.R;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        setupNavigation();
    }

    private void setupNavigation() {
        BottomNavigationView navView = findViewById(R.id.bottom_navigation);

        NavHostFragment navHostFragment = (NavHostFragment) getSupportFragmentManager()
                .findFragmentById(R.id.nav_host_fragment);

        if (navHostFragment != null) {
            NavController navController = navHostFragment.getNavController();
            NavigationUI.setupWithNavController(navView, navController);

            navView.setOnItemSelectedListener(item -> {
                int itemId = item.getItemId();

                if (navController.getCurrentDestination() != null && navController.getCurrentDestination().getId() == itemId) {
                    return true;
                }

                NavOptions navOptions = new NavOptions.Builder()
                        .setLaunchSingleTop(true)
                        .setPopUpTo(itemId, true)
                        .build();

                navController.navigate(itemId, null, navOptions);
                return true;
            });

            navController.addOnDestinationChangedListener((controller, destination, arguments) -> {
                int id = destination.getId();
                if (id == R.id.loginFragment || id == R.id.registroFragment) {
                    navView.setVisibility(View.GONE);
                } else {
                    navView.setVisibility(View.VISIBLE);
                }
            });
        }
    }
}