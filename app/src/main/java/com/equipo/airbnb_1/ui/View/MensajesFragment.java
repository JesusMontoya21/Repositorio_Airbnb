package com.equipo.airbnb_1.ui.View;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.equipo.airbnb_1.R;
import com.google.android.material.button.MaterialButton;

public class MensajesFragment extends Fragment {

    private LinearLayout layoutInvitado, layoutUsuario;
    private MaterialButton btnIrALogin;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_mensajes, container, false);

        layoutInvitado = view.findViewById(R.id.layout_invitado_mensajes);
        layoutUsuario = view.findViewById(R.id.layout_usuario_mensajes);
        btnIrALogin = view.findViewById(R.id.btnIrALoginMensajes);

        SharedPreferences preferences = requireActivity().getSharedPreferences("user_session", Context.MODE_PRIVATE);
        String token = preferences.getString("auth_token", null);

        if (token == null) {
            layoutInvitado.setVisibility(View.VISIBLE);
            layoutUsuario.setVisibility(View.GONE);

            if (btnIrALogin != null) {
                btnIrALogin.setOnClickListener(v -> {
                    Navigation.findNavController(v).navigate(R.id.action_mensajes_to_login);
                });
            }
        } else {
            layoutInvitado.setVisibility(View.GONE);
            layoutUsuario.setVisibility(View.VISIBLE);
        }

        return view;
    }
}