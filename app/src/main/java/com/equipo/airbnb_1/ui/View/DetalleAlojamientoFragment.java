package com.equipo.airbnb_1.ui.View;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
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

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DetalleAlojamientoFragment extends Fragment {

    private ImageView ivDetalleImagen;
    private TextView tvDetalleTitulo, tvDetallePrecio, tvDetalleCaracteristicas, tvDetalleDescripcion;
    private Button btnReservar;

    private LinearLayout layoutAccionesViaje;
    private Button btnCancelarViaje, btnConfirmarViaje;
    private boolean esViaje = false;
    private int reservaId;
    private String estadoViaje = "pending";
    private String fechaFinViaje = "";

    private int alojamientoId;
    private double precioPorNoche = 0.0;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (getArguments() != null) {
            alojamientoId = getArguments().getInt("alojamiento_id");
            esViaje = getArguments().getBoolean("es_viaje", false);
            reservaId = getArguments().getInt("reserva_id", 0);
            estadoViaje = getArguments().getString("estado_viaje", "pending");
            fechaFinViaje = getArguments().getString("fecha_fin", "");
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

        layoutAccionesViaje = view.findViewById(R.id.layoutAccionesViaje);
        btnCancelarViaje = view.findViewById(R.id.btnCancelarViaje);
        btnConfirmarViaje = view.findViewById(R.id.btnConfirmarViaje);

        if (btnConfirmarViaje != null) {
            btnConfirmarViaje.setOnClickListener(v -> mostrarDialogoMetodoPago());
        }
        if (btnCancelarViaje != null) {
            btnCancelarViaje.setOnClickListener(v -> actualizarEstadoViajeEnServidor("cancelado"));
        }

        if (esViaje) {
            btnReservar.setVisibility(View.GONE);

            if (esViajePasado(fechaFinViaje)) {
                layoutAccionesViaje.setVisibility(View.GONE);
                Toast.makeText(getContext(), "Este viaje ya concluyó (Historial)", Toast.LENGTH_SHORT).show();
            } else if (estadoViaje.equalsIgnoreCase("confirmado") || estadoViaje.equalsIgnoreCase("approved") || estadoViaje.equalsIgnoreCase("confirmed")) {
                layoutAccionesViaje.setVisibility(View.GONE);
            } else {
                layoutAccionesViaje.setVisibility(View.VISIBLE);
            }
        } else {
            btnReservar.setVisibility(View.VISIBLE);
            layoutAccionesViaje.setVisibility(View.GONE);
        }

        cargarDatosDesdeServidor();

        btnReservar.setOnClickListener(v -> abrirCalendarioDeReservas());

        return view;
    }

    private boolean esViajePasado(String fechaCheckoutStr) {
        if (fechaCheckoutStr == null || fechaCheckoutStr.isEmpty()) return false;

        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
            Date fechaCheckout = sdf.parse(fechaCheckoutStr);
            Date fechaActual = new Date();

            return fechaActual.after(fechaCheckout);
        } catch (ParseException e) {
            android.util.Log.e("FECHA_ERROR", "Error parseando fecha: " + e.getMessage());
            return false;
        }
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
                    Toast.makeText(getContext(), "Error al cargar los detalles", Toast.LENGTH_SHORT).show();
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

    private void actualizarEstadoViajeEnServidor(String nuevoEstado) {
        android.content.SharedPreferences prefs = requireContext().getSharedPreferences("user_session", android.content.Context.MODE_PRIVATE);
        String tokenCompleto = "Bearer " + prefs.getString("auth_token", "");

        ApiService apiService = RetrofitClient.getApiService(requireContext());

        if (nuevoEstado.equalsIgnoreCase("cancelado")) {
            apiService.cancelarReserva(tokenCompleto, reservaId).enqueue(new retrofit2.Callback<Void>() {
                @Override
                public void onResponse(@NonNull retrofit2.Call<Void> call, @NonNull retrofit2.Response<Void> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(getContext(), "¡Viaje cancelado correctamente!", Toast.LENGTH_LONG).show();
                        if (getActivity() != null) getActivity().onBackPressed();
                    } else {
                        try {
                            if (response.errorBody() != null) {
                                String errorBackend = response.errorBody().string();
                                android.util.Log.e("ERROR_POSTGRES_CANCEL", errorBackend);
                                Toast.makeText(getContext(), "Error al cancelar: " + errorBackend, Toast.LENGTH_LONG).show();
                            } else {
                                Toast.makeText(getContext(), "Error del servidor: " + response.code(), Toast.LENGTH_SHORT).show();
                            }
                        } catch (Exception e) {
                            Toast.makeText(getContext(), "Error al procesar cancelación", Toast.LENGTH_SHORT).show();
                        }
                    }
                }

                @Override
                public void onFailure(@NonNull retrofit2.Call<Void> call, @NonNull Throwable t) {
                    Toast.makeText(getContext(), "Fallo de red: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });

        } else if (nuevoEstado.equalsIgnoreCase("confirmado")) {
            apiService.confirmarReserva(tokenCompleto, reservaId).enqueue(new retrofit2.Callback<Void>() {
                @Override
                public void onResponse(@NonNull retrofit2.Call<Void> call, @NonNull retrofit2.Response<Void> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(getContext(), "¡Viaje confirmado correctamente!", Toast.LENGTH_LONG).show();
                        if (getActivity() != null) getActivity().onBackPressed();
                    } else {
                        try {
                            if (response.errorBody() != null) {
                                String errorBackend = response.errorBody().string();
                                android.util.Log.e("ERROR_POSTGRES_CONFIRM", errorBackend);
                                Toast.makeText(getContext(), "Error al confirmar: " + errorBackend, Toast.LENGTH_LONG).show();
                            } else {
                                Toast.makeText(getContext(), "Error del servidor: " + response.code(), Toast.LENGTH_SHORT).show();
                            }
                        } catch (Exception e) {
                            Toast.makeText(getContext(), "Error al procesar confirmación", Toast.LENGTH_SHORT).show();
                        }
                    }
                }

                @Override
                public void onFailure(@NonNull retrofit2.Call<Void> call, @NonNull Throwable t) {
                    Toast.makeText(getContext(), "Error de red: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        }
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
            enviarReservaAlServidor(checkInStr, checkOutStr, 1, totalPrice);
        });

        datePicker.show(getParentFragmentManager(), "DATE_PICKER_TAG");
    }

    private void enviarReservaAlServidor(String checkIn, String checkOut, int guests, double totalPrice) {
        SharedPreferences prefs = requireContext().getSharedPreferences("user_session", Context.MODE_PRIVATE);
        String tokenCompleto = "Bearer " + prefs.getString("auth_token", "");

        BookingRequest request = new BookingRequest(alojamientoId, checkIn, checkOut, guests, totalPrice);
        ApiService apiService = RetrofitClient.getApiService(requireContext());

        apiService.crearReservacion(tokenCompleto, request).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(getContext(), "¡Reservación creada con éxito!", Toast.LENGTH_LONG).show();

                    if (getActivity() != null && getView() != null) {
                        androidx.navigation.NavController navController = androidx.navigation.Navigation.findNavController(getView());

                        navController.popBackStack(R.id.nav_navegacion, false);
                    }
                } else {
                    Toast.makeText(getContext(), "Error: " + response.code(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                Toast.makeText(getContext(), "Fallo: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void mostrarDialogoMetodoPago() {
        com.google.android.material.bottomsheet.BottomSheetDialog dialog =
                new com.google.android.material.bottomsheet.BottomSheetDialog(requireContext());

        View dialogView = getLayoutInflater().inflate(R.layout.dialog_metodo_pago, null);
        dialog.setContentView(dialogView);

        LinearLayout layoutMenu = dialogView.findViewById(R.id.layoutMenuMetodos);
        LinearLayout layoutTarjeta = dialogView.findViewById(R.id.layoutFormularioTarjeta);
        LinearLayout layoutPaypal = dialogView.findViewById(R.id.layoutFormularioPaypal);
        LinearLayout layoutOxxo = dialogView.findViewById(R.id.layoutResultadoOxxo);
        LinearLayout layoutCargando = dialogView.findViewById(R.id.layoutCargandoPago);
        TextView tvProgresoPago = dialogView.findViewById(R.id.tvProgresoPago);

        LinearLayout btnTarjeta = dialogView.findViewById(R.id.btnPagoTarjeta);
        LinearLayout btnPaypal = dialogView.findViewById(R.id.btnPagoPaypal);
        LinearLayout btnOxxo = dialogView.findViewById(R.id.btnPagoOxxo);

        android.widget.EditText etNoTarjeta = dialogView.findViewById(R.id.etNumeroTarjeta);
        android.widget.EditText etVence = dialogView.findViewById(R.id.etVencimientoTarjeta);
        android.widget.EditText etCvv = dialogView.findViewById(R.id.etCvvTarjeta);
        Button btnFinalizarTarjeta = dialogView.findViewById(R.id.btnFinalizarTarjeta);

        android.widget.EditText etMailPaypal = dialogView.findViewById(R.id.etCorreoPaypal);
        android.widget.EditText etPassPaypal = dialogView.findViewById(R.id.etPasswordPaypal);
        Button btnFinalizarPaypal = dialogView.findViewById(R.id.btnFinalizarPaypal);

        TextView tvMontoOxxo = dialogView.findViewById(R.id.tvMontoOxxo);
        Button btnEntendidoOxxo = dialogView.findViewById(R.id.btnEntendidoOxxo);

        // 🌟 NATIVO: Formateador dinámico para inyectar la diagonal (MM/AA) automáticamente
        etVence.addTextChangedListener(new TextWatcher() {
            private boolean estaBorrando = false;

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                estaBorrando = count > after;
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {}

            @Override
            public void afterTextChanged(Editable s) {
                if (estaBorrando) return;

                if (s.length() == 2) {
                    s.append("/");
                } else if (s.length() == 3 && s.charAt(2) != '/') {
                    s.insert(2, "/");
                }
            }
        });

        btnTarjeta.setOnClickListener(v -> {
            layoutMenu.setVisibility(View.GONE);
            layoutTarjeta.setVisibility(View.VISIBLE);
        });

        btnFinalizarTarjeta.setOnClickListener(v -> {
            if(etNoTarjeta.getText().toString().length() < 16 || etCvv.getText().toString().length() < 3 || etVence.getText().toString().length() < 5) {
                Toast.makeText(getContext(), "Por favor, completa los datos de la tarjeta bancaria", Toast.LENGTH_SHORT).show();
                return;
            }
            layoutTarjeta.setVisibility(View.GONE);
            tvProgresoPago.setText("Conectando con pasarela bancaria...");
            layoutCargando.setVisibility(View.VISIBLE);
            dialog.setCancelable(false);

            new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(() -> {
                dialog.dismiss();
                Toast.makeText(getContext(), "¡Pago con Tarjeta autorizado con éxito!", Toast.LENGTH_LONG).show();
                actualizarEstadoViajeEnServidor("confirmado");
            }, 2500);
        });

        btnPaypal.setOnClickListener(v -> {
            layoutMenu.setVisibility(View.GONE);
            layoutPaypal.setVisibility(View.VISIBLE);
        });

        btnFinalizarPaypal.setOnClickListener(v -> {
            if(!etMailPaypal.getText().toString().contains("@") || etPassPaypal.getText().toString().isEmpty()) {
                Toast.makeText(getContext(), "Introduce tus credenciales de PayPal válidas", Toast.LENGTH_SHORT).show();
                return;
            }
            layoutPaypal.setVisibility(View.GONE);
            tvProgresoPago.setText("Solicitando cobro a cuenta de PayPal...");
            layoutCargando.setVisibility(View.VISIBLE);
            dialog.setCancelable(false);

            new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(() -> {
                dialog.dismiss();
                Toast.makeText(getContext(), "¡Sesión verificada! Fondos de PayPal transferidos.", Toast.LENGTH_LONG).show();
                actualizarEstadoViajeEnServidor("confirmado");
            }, 2500);
        });

        btnOxxo.setOnClickListener(v -> {
            layoutMenu.setVisibility(View.GONE);
            tvProgresoPago.setText("Estableciendo orden de cobro en efectivo...");
            layoutCargando.setVisibility(View.VISIBLE);
            dialog.setCancelable(false);

            new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(() -> {
                layoutCargando.setVisibility(View.GONE);
                tvMontoOxxo.setText("Total a pagar: " + tvDetallePrecio.getText().toString());
                layoutOxxo.setVisibility(View.VISIBLE);
                dialog.setCancelable(true);
            }, 2000);
        });

        btnEntendidoOxxo.setOnClickListener(v -> {
            dialog.dismiss();
            Toast.makeText(getContext(), "Orden de pago guardada. Estado: Pendiente de confirmación.", Toast.LENGTH_LONG).show();

            actualizarEstadoViajeEnServidor("pending");
        });

        dialog.show();
    }
}