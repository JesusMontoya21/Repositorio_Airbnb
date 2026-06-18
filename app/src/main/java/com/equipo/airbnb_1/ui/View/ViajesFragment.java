package com.equipo.airbnb_1.ui.View;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.equipo.airbnb_1.R;
import com.equipo.airbnb_1.ui.Components.ViajesAdapter;
import com.equipo.airbnb_1.ui.Model.BookingResponse;
import com.equipo.airbnb_1.ui.Network.ApiService;
import com.equipo.airbnb_1.ui.Network.RetrofitClient;
import com.google.android.material.button.MaterialButton;

import java.text.SimpleDateFormat; // 🌟 IMPORTANTE: Añadido para procesar las fechas
import java.util.Locale;           // 🌟 IMPORTANTE: Añadido para el idioma local
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ViajesFragment extends Fragment {

    private LinearLayout layoutInvitado, layoutUsuario;
    private MaterialButton btnIrALogin;

    private RecyclerView rvViajes;
    private ViajesAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_viajes, container, false);

        layoutInvitado = view.findViewById(R.id.layout_invitado_viajes);
        layoutUsuario = view.findViewById(R.id.layout_usuario_viajes);
        btnIrALogin = view.findViewById(R.id.btnIrALoginViajes);

        rvViajes = view.findViewById(R.id.rvViajes);

        SharedPreferences preferences = requireActivity().getSharedPreferences("user_session", Context.MODE_PRIVATE);
        String token = preferences.getString("auth_token", null);

        if (token == null) {
            layoutInvitado.setVisibility(View.VISIBLE);
            layoutUsuario.setVisibility(View.GONE);

            if (btnIrALogin != null) {
                btnIrALogin.setOnClickListener(v -> {
                    Navigation.findNavController(v).navigate(R.id.action_viajes_to_login);
                });
            }
        } else {
            layoutInvitado.setVisibility(View.GONE);
            layoutUsuario.setVisibility(View.VISIBLE);

            if (rvViajes != null) {
                rvViajes.setLayoutManager(new LinearLayoutManager(getContext()));
                cargarMisViajesDesdeLaravel(token);
            }
        }

        return view;
    }

    private void cargarMisViajesDesdeLaravel(String tokenRaw) {
        String tokenCompleto = "Bearer " + tokenRaw;

        ApiService apiService = RetrofitClient.getApiService(requireContext());
        apiService.obtenerMisViajes(tokenCompleto).enqueue(new Callback<List<BookingResponse>>() {
            @Override
            public void onResponse(@NonNull Call<List<BookingResponse>> call, @NonNull Response<List<BookingResponse>> response) {
                Log.d("VIAJES_DEBUG", "Código HTTP del servidor: " + response.code());

                if (response.isSuccessful() && response.body() != null) {
                    List<BookingResponse> viajesRaw = response.body();
                    Log.d("VIAJES_DEBUG", "Cantidad de viajes mapeados: " + viajesRaw.size());

                    if (viajesRaw.isEmpty()) {
                        Toast.makeText(getContext(), "Aún no tienes reservaciones registradas.", Toast.LENGTH_LONG).show();
                    }

                    List<BookingResponse> viajesOrdenados = separarYOrdenarViajes(viajesRaw);

                    adapter = new ViajesAdapter(viajesOrdenados);
                    rvViajes.setAdapter(adapter);
                } else {
                    Toast.makeText(getContext(), "Error del servidor al leer viajes: " + response.code(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<BookingResponse>> call, @NonNull Throwable t) {
                Log.e("VIAJES_DEBUG", "Error crítico en parseo o red: " + t.getMessage());
                Toast.makeText(getContext(), "Fallo de conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private List<BookingResponse> separarYOrdenarViajes(List<BookingResponse> listaOriginal) {
        List<BookingResponse> vigentes = new java.util.ArrayList<>();
        List<BookingResponse> pasados = new java.util.ArrayList<>();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
        String fechaHoyStr = sdf.format(new java.util.Date());

        try {
            java.util.Date fechaActual = sdf.parse(fechaHoyStr);

            for (BookingResponse viaje : listaOriginal) {
                if (viaje.getCheckOut() != null && !viaje.getCheckOut().isEmpty()) {
                    java.util.Date fechaCheckout = sdf.parse(viaje.getCheckOut());

                    if (fechaActual.after(fechaCheckout)) {
                        pasados.add(viaje);
                    } else {
                        vigentes.add(viaje);
                    }
                } else {
                    vigentes.add(viaje);
                }
            }
        } catch (Exception e) {
            android.util.Log.e("FILTRO_VIAJES", "Error parseando fechas: " + e.getMessage());
            return listaOriginal;
        }

        List<BookingResponse> listaOrdenada = new java.util.ArrayList<>();
        listaOrdenada.addAll(vigentes);
        listaOrdenada.addAll(pasados);

        return listaOrdenada;
    }
}