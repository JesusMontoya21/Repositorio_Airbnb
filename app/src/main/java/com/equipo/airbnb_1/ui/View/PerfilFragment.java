package com.equipo.airbnb_1.ui.View;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.equipo.airbnb_1.R;

public class PerfilFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_perfil, container, false);

        LinearLayout layoutInvitado = view.findViewById(R.id.layout_invitado);
        LinearLayout layoutUsuario = view.findViewById(R.id.layout_usuario);
        Button btnIrALogin = view.findViewById(R.id.btnIrALogin);
        Button btnCerrarSesion = view.findViewById(R.id.btnCerrarSesion);

        SharedPreferences preferences = requireActivity().getSharedPreferences("user_session", Context.MODE_PRIVATE);
        String token = preferences.getString("auth_token", null);

        if (token != null) {
            layoutInvitado.setVisibility(View.GONE);
            layoutUsuario.setVisibility(View.VISIBLE);
        } else {
            layoutInvitado.setVisibility(View.VISIBLE);
            layoutUsuario.setVisibility(View.GONE);
        }

        btnIrALogin.setOnClickListener(v -> {
            Navigation.findNavController(v).navigate(R.id.loginFragment);
        });

        btnCerrarSesion.setOnClickListener(v -> {
            preferences.edit().remove("auth_token").apply();
            Navigation.findNavController(v).navigate(R.id.nav_perfil);
        });

        return view;
    }
    @Override
    public void onResume() {
        super.onResume();
        SharedPreferences preferences = requireActivity().getSharedPreferences("user_session", Context.MODE_PRIVATE);
        String token = preferences.getString("auth_token", null);
        Log.d("SESION_CHECK", "Buscando token en Perfil: " + token);

        if (getView() != null) {
            View layoutInvitado = getView().findViewById(R.id.layout_invitado);
            View layoutUsuario = getView().findViewById(R.id.layout_usuario);

            if (token != null) {
                layoutInvitado.setVisibility(View.GONE);
                layoutUsuario.setVisibility(View.VISIBLE);
            } else {
                layoutInvitado.setVisibility(View.VISIBLE);
                layoutUsuario.setVisibility(View.GONE);
            }
        }
    }
}

