package com.equipo.airbnb_1.ui.View;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar; // 🌟 NUEVO
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.equipo.airbnb_1.R;
import com.equipo.airbnb_1.ui.Components.AlojamientoAdapter;
import com.equipo.airbnb_1.ui.Model.Alojamiento;
import com.equipo.airbnb_1.ui.Network.ApiService;
import com.equipo.airbnb_1.ui.Network.RetrofitClient;

import java.util.List;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AlojamientosFragment extends Fragment {

    private TextView btnAlojamientos, btnExperiencias, btnServicios;
    private RecyclerView recyclerCarrusel;
    private ProgressBar progressCargaAlojamientos;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_alojamientos, container, false);
        View header = view.findViewById(R.id.header_home);

        if (header != null) {
            btnAlojamientos = header.findViewById(R.id.btnAlojamientos);
            btnExperiencias = header.findViewById(R.id.btnExperiencias);
            btnServicios = header.findViewById(R.id.btnServicios);
        }

        progressCargaAlojamientos = view.findViewById(R.id.progressCargaAlojamientos);

        recyclerCarrusel = view.findViewById(R.id.recyclerCarrusel);
        recyclerCarrusel.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));

        seleccionarSeccion("Alojamientos");

        if (btnAlojamientos != null) btnAlojamientos.setOnClickListener(v -> seleccionarSeccion("Alojamientos"));
        if (btnExperiencias != null) btnExperiencias.setOnClickListener(v -> seleccionarSeccion("Experiencias"));
        if (btnServicios != null) btnServicios.setOnClickListener(v -> seleccionarSeccion("Servicios"));

        return view;
    }

    private void seleccionarSeccion(String seccion) {
        int colorRosa = Color.parseColor("#FF385C");
        int colorGrisMutado = Color.parseColor("#888888");

        if (btnAlojamientos != null) {
            btnAlojamientos.setBackgroundResource(R.drawable.bg_chip_inactive);
            btnAlojamientos.setTextColor(colorGrisMutado);
        }
        if (btnExperiencias != null) {
            btnExperiencias.setBackgroundResource(R.drawable.bg_chip_inactive);
            btnExperiencias.setTextColor(colorGrisMutado);
        }
        if (btnServicios != null) {
            btnServicios.setBackgroundResource(R.drawable.bg_chip_inactive);
            btnServicios.setTextColor(colorGrisMutado);
        }

        switch (seccion) {
            case "Alojamientos":
                if (btnAlojamientos != null) {
                    btnAlojamientos.setBackgroundResource(R.drawable.bg_chip_active);
                    btnAlojamientos.setTextColor(colorRosa);
                }
                cargarAlojamientosDesdeServidor();
                break;

            case "Experiencias":
                if (btnExperiencias != null) {
                    btnExperiencias.setBackgroundResource(R.drawable.bg_chip_active);
                    btnExperiencias.setTextColor(colorRosa);
                }
                break;

            case "Servicios":
                if (btnServicios != null) {
                    btnServicios.setBackgroundResource(R.drawable.bg_chip_active);
                    btnServicios.setTextColor(colorRosa);
                }
                break;
        }
    }

    private void cargarAlojamientosDesdeServidor() {
        if (progressCargaAlojamientos != null) progressCargaAlojamientos.setVisibility(View.VISIBLE);
        if (recyclerCarrusel != null) recyclerCarrusel.setVisibility(View.GONE);

        ApiService apiService = RetrofitClient.getApiService(requireContext());

        apiService.getAlojamientos().enqueue(new Callback<List<Alojamiento>>() {
            @Override
            public void onResponse(@NonNull Call<List<Alojamiento>> call, @NonNull Response<List<Alojamiento>> response) {
                if (progressCargaAlojamientos != null) progressCargaAlojamientos.setVisibility(View.GONE);
                if (recyclerCarrusel != null) recyclerCarrusel.setVisibility(View.VISIBLE);

                if (response.isSuccessful() && response.body() != null) {
                    List<Alojamiento> listaAlojamientos = response.body();

                    if (listaAlojamientos.isEmpty()) {
                        Toast.makeText(getContext(), "No hay alojamientos disponibles", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    AlojamientoAdapter adapter = new AlojamientoAdapter(listaAlojamientos);
                    recyclerCarrusel.setAdapter(adapter);
                } else {
                    Toast.makeText(getContext(), "Error al obtener datos del servidor", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Alojamiento>> call, @NonNull Throwable t) {
                if (progressCargaAlojamientos != null) progressCargaAlojamientos.setVisibility(View.GONE);
                if (recyclerCarrusel != null) recyclerCarrusel.setVisibility(View.VISIBLE);

                Toast.makeText(getContext(), "Error de conexión: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }
}