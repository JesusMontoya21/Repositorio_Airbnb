package com.equipo.airbnb_1.ui.View;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.equipo.airbnb_1.R;
import com.equipo.airbnb_1.ui.Model.BookingResponse;
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

        String checkInLimpio = viaje.getCheckIn();
        String checkOutLimpio = viaje.getCheckOut();

        if (checkInLimpio != null && checkInLimpio.contains("T")) {
            checkInLimpio = checkInLimpio.split("T")[0];
        }
        if (checkOutLimpio != null && checkOutLimpio.contains("T")) {
            checkOutLimpio = checkOutLimpio.split("T")[0];
        }

        holder.tvViajeFechas.setText(checkInLimpio + " al " + checkOutLimpio);
        holder.tvViajePrecio.setText("$" + viaje.getTotalPrice() + " MXN");
        holder.tvViajeStatus.setText(viaje.getStatus().toUpperCase());

        if (viaje.getProperty() != null) {

            holder.tvViajeTitulo.setText(viaje.getProperty().getTitulo());

            String urlImagen = "https://via.placeholder.com/300";

            if (viaje.getProperty().getImages() != null && !viaje.getProperty().getImages().isEmpty()) {
                urlImagen = viaje.getProperty().getImages().get(0).getUrl();
            }

            Glide.with(holder.itemView.getContext())
                    .load(urlImagen)
                    .placeholder(android.R.drawable.ic_menu_gallery)
                    .into(holder.ivViajeImagen);
        } else {
            holder.tvViajeTitulo.setText("Alojamiento Reservado");
        }
    }

    @Override
    public int getItemCount() {
        return listaViajes != null ? listaViajes.size() : 0;
    }

    public static class ViajeViewHolder extends RecyclerView.ViewHolder {
        ImageView ivViajeImagen;
        TextView tvViajeTitulo, tvViajeFechas, tvViajePrecio, tvViajeStatus;

        public ViajeViewHolder(@NonNull View itemView) {
            super(itemView);
            ivViajeImagen = itemView.findViewById(R.id.ivViajeImagen);
            tvViajeTitulo = itemView.findViewById(R.id.tvViajeTitulo);
            tvViajeFechas = itemView.findViewById(R.id.tvViajeFechas);
            tvViajePrecio = itemView.findViewById(R.id.tvViajePrecio);
            tvViajeStatus = itemView.findViewById(R.id.tvViajeStatus);
        }
    }
}