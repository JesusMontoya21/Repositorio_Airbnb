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
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog; // 🌟 NUEVO para los Términos
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.equipo.airbnb_1.R;

public class PerfilFragment extends Fragment {

    private LinearLayout layoutInvitado, layoutUsuario;
    private Button btnIrALogin, btnCerrarSesion;
    private SharedPreferences preferences;
    private TextView tvNombreUsuario, tvCorreoUsuario;
    private LinearLayout btnModoAnfitrion, btnTerminosCondiciones;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_perfil, container, false);

        tvNombreUsuario = view.findViewById(R.id.tvNombreUsuario);
        tvCorreoUsuario = view.findViewById(R.id.tvCorreoUsuario);

        layoutInvitado = view.findViewById(R.id.layout_invitado);
        layoutUsuario = view.findViewById(R.id.layout_usuario);

        btnIrALogin = view.findViewById(R.id.btnIrALogin);
        btnCerrarSesion = view.findViewById(R.id.btnCerrarSesion);

        btnModoAnfitrion = view.findViewById(R.id.btnModoAnfitrion);
        btnTerminosCondiciones = view.findViewById(R.id.btnTerminosCondiciones);

        preferences = requireActivity().getSharedPreferences("user_session", Context.MODE_PRIVATE);

        actualizarInterfazUsuario();

        if (btnIrALogin != null) {
            btnIrALogin.setOnClickListener(v -> {
                Navigation.findNavController(v).navigate(R.id.loginFragment);
            });
        }

        if (btnCerrarSesion != null) {
            btnCerrarSesion.setOnClickListener(v -> {
                preferences.edit()
                        .remove("auth_token")
                        .remove("user_name")
                        .remove("user_email")
                        .apply();
                actualizarInterfazUsuario();
            });
        }

        if (btnTerminosCondiciones != null) {
            btnTerminosCondiciones.setOnClickListener(v -> mostrarTerminosYCondiciones());
        }

        if (btnModoAnfitrion != null) {
            btnModoAnfitrion.setOnClickListener(v -> {
                Navigation.findNavController(v).navigate(R.id.action_nav_perfil_to_hostDashboardFragment);
            });
        }

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
            if (layoutInvitado != null) layoutInvitado.setVisibility(View.GONE);
            if (layoutUsuario != null) layoutUsuario.setVisibility(View.VISIBLE);

            String nombreReal = preferences.getString("user_name", "");
            String correoReal = preferences.getString("user_email", "usuario@correo.com");
            Log.d("SESION_CHECK", "Nombre recuperado en interfaz: " + nombreReal);

            if (tvNombreUsuario != null) {
                if (!nombreReal.isEmpty()) {
                    tvNombreUsuario.setText("¡Hola, " + nombreReal + "!");
                } else {
                    tvNombreUsuario.setText("¡Hola!");
                }
            }

            if (tvCorreoUsuario != null) {
                tvCorreoUsuario.setText(correoReal);
            }

        } else {
            if (layoutInvitado != null) layoutInvitado.setVisibility(View.VISIBLE);
            if (layoutUsuario != null) layoutUsuario.setVisibility(View.GONE);
        }
    }

    private void mostrarTerminosYCondiciones() {
        if (getContext() == null) return;

        AlertDialog.Builder builder = new AlertDialog.Builder(requireContext());
        builder.setTitle("Términos y Condiciones de Servicio");
        builder.setMessage("Bienvenido al clon de Airbnb. Al usar esta aplicación móvil de prueba académica, aceptas que tus datos simulados se almacenen localmente y en una base de datos PostgreSQL de entorno controlado con fines estrictamente escolares.\n\n" +
                "1. Aceptas que las pasarelas de pago (Tarjeta, PayPal, OXXO) son simulaciones y ningún cobro real será efectuado a tus cuentas bancarias.\n\n" +
                "2. Las reservaciones de propiedades quedan sujetas a la disponibilidad del servidor backend programado en Laravel.");
        builder.setPositiveButton("Entendido", (dialog, which) -> dialog.dismiss());

        AlertDialog dialog = builder.create();
        dialog.show();
    }
}