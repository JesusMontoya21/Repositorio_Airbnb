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

    private LinearLayout layoutInvitado, layoutUsuario;
    private Button btnIrALogin, btnCerrarSesion;
    private SharedPreferences preferences;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_perfil, container, false);

        layoutInvitado = view.findViewById(R.id.layout_invitado);
        layoutUsuario = view.findViewById(R.id.layout_usuario);
        btnIrALogin = view.findViewById(R.id.btnIrALogin);
        btnCerrarSesion = view.findViewById(R.id.btnCerrarSesion);

        preferences = requireActivity().getSharedPreferences("user_session", Context.MODE_PRIVATE);

        actualizarInterfazUsuario();

        btnIrALogin.setOnClickListener(v -> {
            Navigation.findNavController(v).navigate(R.id.loginFragment);
        });

        btnCerrarSesion.setOnClickListener(v -> {
            preferences.edit().remove("auth_token").apply();
            actualizarInterfazUsuario();
        });

        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
        if (getView() != null) {
            actualizarInterfazUsuario();
        }
    }

    private void actualizarInterfazUsuario() {
        String token = preferences.getString("auth_token", null);
        Log.d("SESION_CHECK", "Buscando token en Perfil: " + token);

        if (token != null) {
            layoutInvitado.setVisibility(View.GONE);
            layoutUsuario.setVisibility(View.VISIBLE);
        } else {
            layoutInvitado.setVisibility(View.VISIBLE);
            layoutUsuario.setVisibility(View.GONE);
        }
    }
}