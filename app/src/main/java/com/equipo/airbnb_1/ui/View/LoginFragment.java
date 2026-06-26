package com.equipo.airbnb_1.ui.View;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
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
import com.equipo.airbnb_1.ui.Model.LoginRequest;
import com.equipo.airbnb_1.ui.Model.LoginResponse;
import com.equipo.airbnb_1.ui.Network.ApiService;
import com.equipo.airbnb_1.ui.Network.RetrofitClient;
import com.google.android.material.button.MaterialButton;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginFragment extends Fragment {

    private EditText etEmail, etPassword;
    private MaterialButton btnContinuar, btnIrARegistro;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_login, container, false);

        etEmail = view.findViewById(R.id.etEmail);
        etPassword = view.findViewById(R.id.etPassword);
        btnContinuar = view.findViewById(R.id.btnContinuar);
        btnIrARegistro = view.findViewById(R.id.btnIrARegistro);

        btnContinuar.setOnClickListener(v -> {
            String email = etEmail.getText().toString().trim();
            String password = etPassword.getText().toString().trim();

            if (validarCampos(email, password)) {
                realizarLogin(email, password, v);
            }
        });

        btnIrARegistro.setOnClickListener(v -> {
            Navigation.findNavController(v).navigate(R.id.action_login_to_registro);
        });

        return view;
    }

    private boolean validarCampos(String email, String pass) {
        if (email.isEmpty() || pass.isEmpty()) {
            Toast.makeText(getContext(), "Por favor, rellena todos los campos", Toast.LENGTH_SHORT).show();
            return false;
        }
        return true;
    }

    private void realizarLogin(String email, String password, View v) {
        ApiService apiService = RetrofitClient.getApiService(requireContext());
        LoginRequest loginRequest = new LoginRequest(email, password);

        apiService.login(loginRequest).enqueue(new Callback<LoginResponse>() {
            @Override
            public void onResponse(@NonNull Call<LoginResponse> call, @NonNull Response<LoginResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    LoginResponse loginResponse = response.body();
                    String token = loginResponse.getAccessToken();

                    String nombreUsuario = "";
                    String correoUsuario = "";

                    if (loginResponse.getUser() != null) {
                        try {
                            com.google.gson.Gson gson = new com.google.gson.Gson();
                            String jsonUser = gson.toJson(loginResponse.getUser());

                            android.util.Log.e("JSON_USUARIO_REAL", "El JSON que manda Laravel es: " + jsonUser);

                            com.google.gson.JsonObject jsonObject = gson.fromJson(jsonUser, com.google.gson.JsonObject.class);

                            if (jsonObject.has("name") && !jsonObject.get("name").isJsonNull()) {
                                nombreUsuario = jsonObject.get("name").getAsString();
                            }

                            if (jsonObject.has("email") && !jsonObject.get("email").isJsonNull()) {
                                correoUsuario = jsonObject.get("email").getAsString();
                            }

                        } catch (Exception e) {
                            android.util.Log.e("SESION_CHECK", "Error al extraer datos del usuario: " + e.getMessage());
                        }
                    }

                    SharedPreferences preferences = requireActivity().getSharedPreferences("user_session", Context.MODE_PRIVATE);
                    SharedPreferences.Editor editor = preferences.edit();
                    editor.putString("auth_token", token);
                    editor.putString("user_name", nombreUsuario);
                    editor.putString("user_email", correoUsuario);
                    editor.apply();

                    Log.d("SESION_CHECK", "Datos guardados - Token: " + token + " | Usuario: " + nombreUsuario + " | Correo: " + correoUsuario);
                    Toast.makeText(getContext(), "¡Bienvenido!", Toast.LENGTH_SHORT).show();
                    Navigation.findNavController(v).navigate(R.id.action_login_to_home);
                } else {
                    Toast.makeText(getContext(), "Correo o contraseña incorrectos", Toast.LENGTH_SHORT).show();
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
}