package com.equipo.airbnb_1.ui.View;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.equipo.airbnb_1.R;
import com.equipo.airbnb_1.ui.Model.Alojamiento;
import com.equipo.airbnb_1.ui.Model.PropertyCreateRequest;
import com.equipo.airbnb_1.ui.Network.ApiService;
import com.equipo.airbnb_1.ui.Network.RetrofitClient;
import com.google.android.material.button.MaterialButton;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HostCreatePropertyFragment extends Fragment {

    private EditText etTitle;
    private EditText etDescription;
    private EditText etCity;
    private EditText etAddress;
    private EditText etPrice;
    private EditText etGuests;
    private EditText etBedrooms;
    private EditText etBathrooms;
    private EditText etImageUrl;
    private Spinner spinnerType;
    private MaterialButton btnSubmit;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_host_create_property, container, false);

        etTitle = view.findViewById(R.id.etHostTitle);
        etDescription = view.findViewById(R.id.etHostDescription);
        etCity = view.findViewById(R.id.etHostCity);
        etAddress = view.findViewById(R.id.etHostAddress);
        etPrice = view.findViewById(R.id.etHostPrice);
        etGuests = view.findViewById(R.id.etHostGuests);
        etBedrooms = view.findViewById(R.id.etHostBedrooms);
        etBathrooms = view.findViewById(R.id.etHostBathrooms);
        etImageUrl = view.findViewById(R.id.etHostImageUrl);
        spinnerType = view.findViewById(R.id.spinnerHostType);
        btnSubmit = view.findViewById(R.id.btnSubmitProperty);

        ArrayAdapter<CharSequence> typeAdapter = ArrayAdapter.createFromResource(
                requireContext(),
                R.array.host_property_types,
                android.R.layout.simple_spinner_item
        );
        typeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerType.setAdapter(typeAdapter);

        btnSubmit.setOnClickListener(v -> enviarFormulario());

        return view;
    }

    private void enviarFormulario() {
        String title = etTitle.getText().toString().trim();
        String description = etDescription.getText().toString().trim();
        String city = etCity.getText().toString().trim();
        String address = etAddress.getText().toString().trim();
        String priceText = etPrice.getText().toString().trim();
        String guestsText = etGuests.getText().toString().trim();
        String bedroomsText = etBedrooms.getText().toString().trim();
        String bathroomsText = etBathrooms.getText().toString().trim();
        String imageUrl = etImageUrl.getText().toString().trim();
        String type = spinnerType.getSelectedItem().toString().toLowerCase(Locale.ROOT);

        if (TextUtils.isEmpty(title) || TextUtils.isEmpty(description) || TextUtils.isEmpty(city)
                || TextUtils.isEmpty(address) || TextUtils.isEmpty(priceText) || TextUtils.isEmpty(guestsText)
                || TextUtils.isEmpty(bedroomsText) || TextUtils.isEmpty(bathroomsText)) {
            Toast.makeText(getContext(), "Completa todos los campos obligatorios", Toast.LENGTH_SHORT).show();
            return;
        }

        double pricePerNight;
        int guests;
        int bedrooms;
        double bathrooms;

        try {
            pricePerNight = Double.parseDouble(priceText);
            guests = Integer.parseInt(guestsText);
            bedrooms = Integer.parseInt(bedroomsText);
            bathrooms = Double.parseDouble(bathroomsText);
        } catch (NumberFormatException exception) {
            Toast.makeText(getContext(), "Revisa precio, huéspedes, recámaras y baños", Toast.LENGTH_SHORT).show();
            return;
        }

        if (pricePerNight < 1) {
            Toast.makeText(getContext(), "El precio por noche debe ser mayor a 0", Toast.LENGTH_SHORT).show();
            return;
        }

        if (guests < 1) {
            Toast.makeText(getContext(), "Debe permitir al menos 1 huésped", Toast.LENGTH_SHORT).show();
            return;
        }

        if (bedrooms < 0) {
            Toast.makeText(getContext(), "Las recámaras no pueden ser negativas", Toast.LENGTH_SHORT).show();
            return;
        }

        if (bathrooms < 0.5d) {
            Toast.makeText(getContext(), "Debe indicar al menos 0.5 baños", Toast.LENGTH_SHORT).show();
            return;
        }

        List<String> images = new ArrayList<>();
        if (!TextUtils.isEmpty(imageUrl)) {
            if (!Patterns.WEB_URL.matcher(imageUrl).matches()) {
                Toast.makeText(getContext(), "La imagen debe ser una URL completa y válida", Toast.LENGTH_SHORT).show();
                return;
            }
            images.add(imageUrl);
        }

        PropertyCreateRequest request = new PropertyCreateRequest(
                title,
                description,
                city,
                "México",
                address,
                pricePerNight,
                guests,
                bedrooms,
                bathrooms,
                type,
                images
        );

        SharedPreferences preferences = requireActivity().getSharedPreferences("user_session", Context.MODE_PRIVATE);
        String token = normalizarToken(preferences.getString("auth_token", null));
        if (token == null || token.isEmpty()) {
            Toast.makeText(getContext(), "Debes iniciar sesión", Toast.LENGTH_SHORT).show();
            return;
        }

        btnSubmit.setEnabled(false);
        btnSubmit.setText("Creando...");

        ApiService apiService = RetrofitClient.getApiService(requireContext());
        apiService.crearPropiedad("Bearer " + token, request).enqueue(new Callback<Alojamiento>() {
            @Override
            public void onResponse(@NonNull Call<Alojamiento> call, @NonNull Response<Alojamiento> response) {
                if (!isAdded()) {
                    return;
                }

                btnSubmit.setEnabled(true);
                btnSubmit.setText("Publicar propiedad");

                if (response.isSuccessful()) {
                    Toast.makeText(getContext(), "Propiedad creada correctamente", Toast.LENGTH_SHORT).show();
                    Navigation.findNavController(requireView()).navigateUp();
                } else {
                    Toast.makeText(getContext(), construirMensajeError(response), Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Alojamiento> call, @NonNull Throwable t) {
                if (!isAdded()) {
                    return;
                }

                btnSubmit.setEnabled(true);
                btnSubmit.setText("Publicar propiedad");
                Toast.makeText(getContext(), "Error de red: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
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

    private String construirMensajeError(Response<Alojamiento> response) {
        try {
            if (response.errorBody() == null) {
                return "No se pudo crear la propiedad: " + response.code();
            }

            String rawError = response.errorBody().string();
            if (TextUtils.isEmpty(rawError)) {
                return "No se pudo crear la propiedad: " + response.code();
            }

            JSONObject jsonObject = new JSONObject(rawError);

            if (jsonObject.has("message")) {
                String message = jsonObject.getString("message");
                if (jsonObject.has("errors")) {
                    JSONObject errors = jsonObject.getJSONObject("errors");
                    JSONArray names = errors.names();
                    if (names != null && names.length() > 0) {
                        String firstKey = names.getString(0);
                        JSONArray firstMessages = errors.getJSONArray(firstKey);
                        if (firstMessages.length() > 0) {
                            return firstMessages.getString(0);
                        }
                    }
                }
                return message;
            }

            // Si no viene en formato esperado, devuelve parte del cuerpo para facilitar diagnóstico.
            return "Error " + response.code() + ": " + rawError;
        } catch (Exception ignored) {
            // Fallback al mensaje genérico cuando el backend no devuelve JSON estándar.
        }

        return "No se pudo crear la propiedad: " + response.code();
    }
}