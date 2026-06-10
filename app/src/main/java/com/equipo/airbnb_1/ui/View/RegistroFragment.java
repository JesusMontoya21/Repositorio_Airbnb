package com.equipo.airbnb_1.ui.View;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.equipo.airbnb_1.R;
import com.equipo.airbnb_1.ui.Model.RegisterRequest;
import com.equipo.airbnb_1.ui.Model.LoginResponse;
import com.equipo.airbnb_1.ui.Network.ApiService;
import com.equipo.airbnb_1.ui.Network.RetrofitClient;
import com.google.android.material.button.MaterialButton;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegistroFragment extends Fragment {

    private EditText etNombre, etEmailRegistro, etPasswordRegistro, etConfirmPassword;
    private MaterialButton btnRegistrar;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_registro, container, false);

        etNombre = view.findViewById(R.id.etNombre);
        etEmailRegistro = view.findViewById(R.id.etEmailRegistro);
        etPasswordRegistro = view.findViewById(R.id.etPasswordRegistro);
        etConfirmPassword = view.findViewById(R.id.etConfirmPassword);
        btnRegistrar = view.findViewById(R.id.btnRegistrar);

        btnRegistrar.setOnClickListener(v -> {
            String nombre = etNombre.getText().toString().trim();
            String email = etEmailRegistro.getText().toString().trim();
            String password = etPasswordRegistro.getText().toString().trim();
            String confirmPassword = etConfirmPassword.getText().toString().trim();

            if (validarCampos(nombre, email, password, confirmPassword)) {

                RegisterRequest request = new RegisterRequest(nombre, email, password, confirmPassword);
                ApiService apiService = RetrofitClient.getApiService(requireContext());

                apiService.registrarUsuario(request).enqueue(new Callback<LoginResponse>() {
                    @Override
                    public void onResponse(@NonNull Call<LoginResponse> call, @NonNull Response<LoginResponse> response) {
                        // Verificamos que el fragmento siga activo antes de mover la interfaz gráfica
                        if (getActivity() == null || getView() == null) return;

                        if (response.isSuccessful()) {
                            Toast.makeText(getContext(), "¡Usuario registrado correctamente!", Toast.LENGTH_SHORT).show();

                            // MODO SEGURO: Usamos requireView() en lugar de la 'v' del hilo anterior
                            Navigation.findNavController(requireView()).popBackStack();
                        } else {
                            String mensajeError = "Código: " + response.code();
                            try {
                                mensajeError += " | " + response.errorBody().string();
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                            // Si Laravel rebota la petición (ej: Error 422), saldrá el Toast exacto aquí
                            Toast.makeText(getContext(), mensajeError, Toast.LENGTH_LONG).show();
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<LoginResponse> call, @NonNull Throwable t) {
                        if (getContext() != null) {
                            Toast.makeText(getContext(), "Error de red: " + t.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    }
                });
            }
        });

        return view;
    }

    private boolean validarCampos(String nombre, String email, String pass, String confirmPass) {
        if (nombre.isEmpty() || email.isEmpty() || pass.isEmpty() || confirmPass.isEmpty()) {
            Toast.makeText(getContext(), "Por favor, rellena todos los campos", Toast.LENGTH_SHORT).show();
            return false;
        }
        if (pass.length() < 6) {
            Toast.makeText(getContext(), "La contraseña debe tener al menos 6 caracteres", Toast.LENGTH_SHORT).show();
            return false;
        }
        if (!pass.equals(confirmPass)) {
            Toast.makeText(getContext(), "Las contraseñas no coinciden", Toast.LENGTH_SHORT).show();
            return false;
        }
        return true;
    }
}