package com.equipo.airbnb_1.ui.View;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.bumptech.glide.Glide;
import com.equipo.airbnb_1.R;
import com.equipo.airbnb_1.ui.Network.ApiService;
import com.equipo.airbnb_1.ui.Network.RetrofitClient;
import com.equipo.airbnb_1.ui.Model.PropertyDetalleResponse;
import com.equipo.airbnb_1.ui.Model.BookingRequest;
import com.google.android.material.datepicker.MaterialDatePicker;

import java.text.SimpleDateFormat;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DetalleAlojamientoFragment extends Fragment {

    private ImageView ivDetalleImagen;
    private TextView tvDetalleTitulo, tvDetallePrecio, tvDetalleCaracteristicas, tvDetalleDescripcion;
    private Button btnReservar;
    private int alojamientoId;
    private double precioPorNoche = 0.0;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (getArguments() != null) {
            alojamientoId = getArguments().getInt("alojamiento_id");
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_detalle_alojamiento, container, false);

        ivDetalleImagen = view.findViewById(R.id.ivDetalleImagen);
        tvDetalleTitulo = view.findViewById(R.id.tvDetalleTitulo);
        tvDetallePrecio = view.findViewById(R.id.tvDetallePrecio);
        tvDetalleCaracteristicas = view.findViewById(R.id.tvDetalleCaracteristicas);
        tvDetalleDescripcion = view.findViewById(R.id.tvDetalleDescripcion);
        btnReservar = view.findViewById(R.id.btnReservar);

        cargarDatosDesdeServidor();

        btnReservar.setOnClickListener(v -> {
            abrirCalendarioDeReservas();
        });

        return view;
    }

    private void cargarDatosDesdeServidor() {
        ApiService apiService = RetrofitClient.getApiService(requireContext());
        apiService.obtenerDetalleAlojamiento(alojamientoId).enqueue(new Callback<PropertyDetalleResponse>() {
            @Override
            public void onResponse(@NonNull Call<PropertyDetalleResponse> call, @NonNull Response<PropertyDetalleResponse> response) {
                if (getActivity() == null || getView() == null) return;

                if (response.isSuccessful() && response.body() != null) {
                    PropertyDetalleResponse propiedad = response.body();

                    precioPorNoche = propiedad.getPrecioPerNight();

                    tvDetalleTitulo.setText(propiedad.getTitulo());
                    tvDetallePrecio.setText("$" + precioPorNoche + " MXN / noche");

                    String caracteristicas = propiedad.getGuests() + " huéspedes · " +
                            propiedad.getBedrooms() + " habitaciones · " +
                            propiedad.getBathrooms() + " baños";
                    tvDetalleCaracteristicas.setText(caracteristicas);
                    tvDetalleDescripcion.setText(propiedad.getDescripcion());

                    String urlImagen = "https://via.placeholder.com/300";
                    if (propiedad.getImages() != null && !propiedad.getImages().isEmpty()) {
                        urlImagen = propiedad.getImages().get(0).getUrl();
                    }

                    Glide.with(requireContext())
                            .load(urlImagen)
                            .placeholder(android.R.drawable.ic_menu_gallery)
                            .into(ivDetalleImagen);

                } else {
                    Toast.makeText(getContext(), "Error al cargar los detalles del alojamiento", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NonNull Call<PropertyDetalleResponse> call, @NonNull Throwable t) {
                if (getContext() != null) {
                    Toast.makeText(getContext(), "Error de red: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void abrirCalendarioDeReservas() {
        MaterialDatePicker.Builder<androidx.core.util.Pair<Long, Long>> builder = MaterialDatePicker.Builder.dateRangePicker();
        builder.setTitleText("Selecciona tus fechas de viaje");
        MaterialDatePicker<androidx.core.util.Pair<Long, Long>> datePicker = builder.build();

        datePicker.addOnPositiveButtonClickListener(selection -> {
            Long checkInMillis = selection.first;
            Long checkOutMillis = selection.second;

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
            sdf.setTimeZone(java.util.TimeZone.getTimeZone("UTC"));

            String checkInStr = sdf.format(new java.util.Date(checkInMillis));
            String checkOutStr = sdf.format(new java.util.Date(checkOutMillis));

            long diffInMillis = checkOutMillis - checkInMillis;
            long diasNoches = java.util.concurrent.TimeUnit.MILLISECONDS.toDays(diffInMillis);
            if (diasNoches == 0) diasNoches = 1;

            double totalPrice = diasNoches * precioPorNoche;
            int guests = 1;

            Toast.makeText(getContext(), "Procesando " + diasNoches + " noches: $" + totalPrice + " MXN", Toast.LENGTH_SHORT).show();

            enviarReservaAlServidor(checkInStr, checkOutStr, guests, totalPrice);
        });

        datePicker.show(getParentFragmentManager(), "DATE_PICKER_TAG");
    }

    private void enviarReservaAlServidor(String checkIn, String checkOut, int guests, double totalPrice) {

        android.content.SharedPreferences prefs = requireContext().getSharedPreferences("user_session", android.content.Context.MODE_PRIVATE);
        String tokenGuardado = prefs.getString("auth_token", "");

        String tokenCompleto = "Bearer " + tokenGuardado;

        android.util.Log.d("SESION_CHECK", "Token recuperado en Detalle: " + tokenGuardado);

        BookingRequest request = new BookingRequest(alojamientoId, checkIn, checkOut, guests, totalPrice);
        ApiService apiService = RetrofitClient.getApiService(requireContext());

        apiService.crearReservacion(tokenCompleto, request).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(getContext(), "¡Reservación creada! Revisa tu correo", Toast.LENGTH_LONG).show();
                } else {

                    Toast.makeText(getContext(), "Error del servidor: " + response.code(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                Toast.makeText(getContext(), "Fallo de conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}