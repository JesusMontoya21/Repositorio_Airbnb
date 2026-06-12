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
import com.equipo.airbnb_1.ui.Model.BookingResponse;
import com.equipo.airbnb_1.ui.Network.ApiService;
import com.equipo.airbnb_1.ui.Network.RetrofitClient;
import com.google.android.material.button.MaterialButton;

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
                    List<BookingResponse> viajes = response.body();
                    Log.d("VIAJES_DEBUG", "Cantidad de viajes mapeados: " + viajes.size());

                    if (viajes.isEmpty()) {
                        Toast.makeText(getContext(), "Aún no tienes reservaciones registradas.", Toast.LENGTH_LONG).show();
                    }

                    adapter = new ViajesAdapter(viajes);
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
}