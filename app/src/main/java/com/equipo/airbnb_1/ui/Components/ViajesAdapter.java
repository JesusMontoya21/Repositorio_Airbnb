package com.equipo.airbnb_1.ui.Components;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.equipo.airbnb_1.R;
import com.equipo.airbnb_1.ui.Model.BookingResponse;
import com.equipo.airbnb_1.ui.Model.Alojamiento;

import java.text.SimpleDateFormat;
import java.util.Locale;
import java.util.List;

public class ViajesAdapter extends RecyclerView.Adapter<ViajesAdapter.ViajeViewHolder> {

    private List<BookingResponse> listaViajes;

    public ViajesAdapter(List<BookingResponse> listaViajes) {
        this.listaViajes = listaViajes;
    }

    @NonNull
    @Override
    public ViajeViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_viaje, parent, false);
        return new ViajeViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViajeViewHolder holder, int position) {
        BookingResponse viaje = listaViajes.get(position);
        if (viaje == null) return;

        Alojamiento casa = viaje.getProperty();

        if (casa != null && casa.getTitulo() != null) {
            holder.tvViajeTitulo.setText(casa.getTitulo());
        } else {
            holder.tvViajeTitulo.setText("Alojamiento");
        }

        holder.tvViajeFechas.setText(viaje.getCheckIn() + " al " + viaje.getCheckOut());
        holder.tvViajePrecio.setText("$" + viaje.getTotalPrice() + " MXN");

        String estado = viaje.getStatus() != null ? viaje.getStatus() : "pending";
        holder.tvViajeStatus.setText(estado.toUpperCase());

        if (estado.equalsIgnoreCase("confirmado") || estado.equalsIgnoreCase("approved") || estado.equalsIgnoreCase("confirmed")) {
            holder.tvViajeStatus.setBackgroundResource(android.R.color.holo_green_light);
        } else if (estado.equalsIgnoreCase("cancelado") || estado.equalsIgnoreCase("rejected") || estado.equalsIgnoreCase("cancelled")) {
            holder.tvViajeStatus.setBackgroundResource(android.R.color.holo_red_light);
        } else {
            holder.tvViajeStatus.setBackgroundResource(android.R.color.holo_orange_light);
        }

        if (holder.layoutAccionesViaje != null) {
            holder.layoutAccionesViaje.setVisibility(View.GONE);
        }

        try {
            if (viaje.getCheckOut() != null && !viaje.getCheckOut().isEmpty()) {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
                java.util.Date fechaCheckout = sdf.parse(viaje.getCheckOut());
                java.util.Date fechaActual = sdf.parse(sdf.format(new java.util.Date())); // Hoy a medianoche

                if (fechaActual.after(fechaCheckout)) {
                    holder.itemView.setAlpha(0.55f);
                    holder.tvViajeStatus.setText("CONCLUIDO");
                    holder.tvViajeStatus.setBackgroundResource(android.R.color.darker_gray);
                } else {
                    holder.itemView.setAlpha(1.0f);
                }
            } else {
                holder.itemView.setAlpha(1.0f);
            }
        } catch (Exception e) {
            holder.itemView.setAlpha(1.0f);
        }

        String urlFoto = "";
        if (casa != null && casa.getImages() != null && !casa.getImages().isEmpty()) {
            if (casa.getImages().get(0) != null) {
                urlFoto = casa.getImages().get(0).getUrl();
            }
        }

        if (urlFoto != null && !urlFoto.isEmpty() && !urlFoto.startsWith("http")) {
            urlFoto = "http://192.168.1.6/storage/" + urlFoto;
        }

        Glide.with(holder.itemView.getContext())
                .load(urlFoto.isEmpty() ? null : urlFoto)
                .placeholder(android.R.drawable.ic_menu_gallery)
                .error(android.R.drawable.ic_menu_report_image)
                .into(holder.ivViajeImagen);

        holder.itemView.setOnClickListener(v -> {
            try {
                if (casa != null) {
                    Bundle bundle = new Bundle();
                    bundle.putInt("alojamiento_id", casa.getId());
                    bundle.putInt("reserva_id", viaje.getId());
                    bundle.putBoolean("es_viaje", true);

                    bundle.putString("estado_viaje", viaje.getStatus());
                    bundle.putString("fecha_fin", viaje.getCheckOut());

                    Navigation.findNavController(v).navigate(R.id.detalleAlojamientoFragment, bundle);
                } else {
                    Toast.makeText(holder.itemView.getContext(), "Datos de alojamiento no disponibles", Toast.LENGTH_SHORT).show();
                }
            } catch (Exception e) {
                android.util.Log.e("CRASH_NAVEGACION", "Falla al abrir detalle: " + e.getMessage());
                Toast.makeText(holder.itemView.getContext(), "Error abriendo los detalles", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public int getItemCount() {
        return listaViajes != null ? listaViajes.size() : 0;
    }

    public static class ViajeViewHolder extends RecyclerView.ViewHolder {
        ImageView ivViajeImagen;
        TextView tvViajeTitulo, tvViajeFechas, tvViajePrecio, tvViajeStatus;
        LinearLayout layoutAccionesViaje;

        public ViajeViewHolder(@NonNull View itemView) {
            super(itemView);
            ivViajeImagen = itemView.findViewById(R.id.ivViajeImagen);
            tvViajeTitulo = itemView.findViewById(R.id.tvViajeTitulo);
            tvViajeFechas = itemView.findViewById(R.id.tvViajeFechas);
            tvViajePrecio = itemView.findViewById(R.id.tvViajePrecio);
            tvViajeStatus = itemView.findViewById(R.id.tvViajeStatus);
            layoutAccionesViaje = itemView.findViewById(R.id.layoutAccionesViaje);
        }
    }
}