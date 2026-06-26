package com.equipo.airbnb_1.ui.View;

import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.equipo.airbnb_1.R;
import com.equipo.airbnb_1.ui.Components.HostPropertyAdapter;
import com.equipo.airbnb_1.ui.Model.Alojamiento;
import com.equipo.airbnb_1.ui.Model.HostDashboardResponse;
import com.equipo.airbnb_1.ui.Network.ApiService;
import com.equipo.airbnb_1.ui.Network.RetrofitClient;
import com.google.android.material.button.MaterialButton;

import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HostDashboardFragment extends Fragment {

    private TextView tvTotalProperties;
    private TextView tvTotalBookings;
    private TextView tvTotalRevenue;
    private TextView tvAverageRating;
    private TextView tvEmptyState;
    private RecyclerView rvHostProperties;
    private MaterialButton btnCreateProperty;
    private String authHeader;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_host_dashboard, container, false);

        tvTotalProperties = view.findViewById(R.id.tvTotalProperties);
        tvTotalBookings = view.findViewById(R.id.tvTotalBookings);
        tvTotalRevenue = view.findViewById(R.id.tvTotalRevenue);
        tvAverageRating = view.findViewById(R.id.tvAverageRating);
        tvEmptyState = view.findViewById(R.id.tvHostEmptyState);
        rvHostProperties = view.findViewById(R.id.rvHostProperties);
        btnCreateProperty = view.findViewById(R.id.btnCreateProperty);

        rvHostProperties.setLayoutManager(new LinearLayoutManager(getContext()));

        btnCreateProperty.setOnClickListener(v -> Navigation.findNavController(v).navigate(R.id.action_hostDashboardFragment_to_hostCreatePropertyFragment));

        SharedPreferences preferences = requireActivity().getSharedPreferences("user_session", Context.MODE_PRIVATE);
        String token = normalizarToken(preferences.getString("auth_token", null));

        if (token == null || token.isEmpty()) {
            Toast.makeText(getContext(), "Inicia sesión para usar el modo anfitrión", Toast.LENGTH_SHORT).show();
            Navigation.findNavController(view).navigate(R.id.loginFragment);
            return view;
        }

        authHeader = "Bearer " + token;
        cargarDashboard(authHeader);
        cargarPropiedades(authHeader);

        return view;
    }

    @Override
    public void onResume() {
        super.onResume();

        if (!isAdded()) {
            return;
        }

        SharedPreferences preferences = requireActivity().getSharedPreferences("user_session", Context.MODE_PRIVATE);
        String token = normalizarToken(preferences.getString("auth_token", null));
        if (token != null && !token.isEmpty()) {
            authHeader = "Bearer " + token;
            cargarDashboard(authHeader);
            cargarPropiedades(authHeader);
        }
    }

    private void cargarDashboard(String authHeader) {
        ApiService apiService = RetrofitClient.getApiService(requireContext());
        apiService.obtenerDashboardAnfitrion(authHeader).enqueue(new Callback<HostDashboardResponse>() {
            @Override
            public void onResponse(@NonNull Call<HostDashboardResponse> call, @NonNull Response<HostDashboardResponse> response) {
                if (!isAdded()) {
                    return;
                }

                if (response.isSuccessful() && response.body() != null) {
                    HostDashboardResponse dashboard = response.body();
                    tvTotalProperties.setText(String.valueOf(dashboard.getTotalProperties()));
                    tvTotalBookings.setText(String.valueOf(dashboard.getTotalBookings()));
                    tvTotalRevenue.setText(String.format(Locale.getDefault(), "$%.2f", dashboard.getTotalRevenue()));
                    tvAverageRating.setText(String.format(Locale.getDefault(), "%.1f", dashboard.getAverageRating()));
                } else {
                    int code = response.code();
                    Log.e("HOST_DASH", "Error dashboard, code=" + code);
                    if (code == 401 || code == 403) {
                        forzarReinicioSesion();
                        return;
                    }
                    Toast.makeText(getContext(), "No se pudo cargar el dashboard (" + code + ")", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NonNull Call<HostDashboardResponse> call, @NonNull Throwable t) {
                if (!isAdded()) {
                    return;
                }

                Toast.makeText(getContext(), "Error cargando dashboard: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void cargarPropiedades(String authHeader) {
        ApiService apiService = RetrofitClient.getApiService(requireContext());
        apiService.obtenerMisPropiedades(authHeader).enqueue(new Callback<List<Alojamiento>>() {
            @Override
            public void onResponse(@NonNull Call<List<Alojamiento>> call, @NonNull Response<List<Alojamiento>> response) {
                if (!isAdded()) {
                    return;
                }

                if (response.isSuccessful() && response.body() != null) {
                    List<Alojamiento> propiedades = response.body();
                    if (propiedades.isEmpty()) {
                        tvEmptyState.setVisibility(View.VISIBLE);

                        rvHostProperties.setVisibility(View.GONE);
                    } else {
                        tvEmptyState.setVisibility(View.GONE);
                        rvHostProperties.setVisibility(View.VISIBLE);
                        rvHostProperties.setAdapter(new HostPropertyAdapter(propiedades, HostDashboardFragment.this::confirmarEliminacion));
                    }
                } else {
                    int code = response.code();
                    Log.e("HOST_PROPS", "Error propiedades, code=" + code);
                    if (code == 401 || code == 403) {
                        forzarReinicioSesion();
                        return;
                    }
                    tvEmptyState.setVisibility(View.VISIBLE);
                    tvEmptyState.setText("No fue posible cargar tus propiedades (" + code + ").");
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Alojamiento>> call, @NonNull Throwable t) {
                if (!isAdded()) {
                    return;
                }

                tvEmptyState.setVisibility(View.VISIBLE);
                tvEmptyState.setText("Error de red al cargar propiedades.");
            }
        });
    }

    private void confirmarEliminacion(Alojamiento alojamiento) {
        if (!isAdded()) {
            return;
        }

        new AlertDialog.Builder(requireContext())
                .setTitle("Eliminar propiedad")
                .setMessage("¿Seguro que quieres eliminar '" + alojamiento.getTitulo() + "'?")
                .setNegativeButton("Cancelar", null)
                .setPositiveButton("Eliminar", (DialogInterface dialog, int which) -> eliminarPropiedad(alojamiento.getId()))
                .show();
    }

    private void eliminarPropiedad(int propertyId) {
        if (authHeader == null) {
            Toast.makeText(getContext(), "Sesión no disponible", Toast.LENGTH_SHORT).show();
            return;
        }

        ApiService apiService = RetrofitClient.getApiService(requireContext());
        apiService.eliminarPropiedad(authHeader, propertyId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (!isAdded()) {
                    return;
                }

                if (response.isSuccessful()) {
                    Toast.makeText(getContext(), "Propiedad eliminada", Toast.LENGTH_SHORT).show();
                    cargarDashboard(authHeader);
                    cargarPropiedades(authHeader);
                } else {
                    Toast.makeText(getContext(), "No se pudo eliminar la propiedad", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                if (!isAdded()) {
                    return;
                }

                Toast.makeText(getContext(), "Error al eliminar: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void forzarReinicioSesion() {
        if (!isAdded()) {
            return;
        }

        SharedPreferences preferences = requireActivity().getSharedPreferences("user_session", Context.MODE_PRIVATE);
        preferences.edit()
                .remove("auth_token")
                .remove("user_name")
                .apply();

        Toast.makeText(getContext(), "Tu sesión venció. Inicia sesión de nuevo.", Toast.LENGTH_LONG).show();
        Navigation.findNavController(requireView()).navigate(R.id.loginFragment);
    }

    private String normalizarToken(String rawToken) {
        if (rawToken == null) {
            return null;
        }

        String token = rawToken.trim();
        if (token.toLowerCase().startsWith("bearer ")) {
            token = token.substring(7).trim();
        }

        return token;
    }
}