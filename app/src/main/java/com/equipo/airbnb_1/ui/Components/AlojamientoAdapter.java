package com.equipo.airbnb_1.ui.Components;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.equipo.airbnb_1.R;
import com.equipo.airbnb_1.ui.Model.Alojamiento;
import java.util.List;

public class AlojamientoAdapter extends RecyclerView.Adapter<AlojamientoAdapter.AlojamientoViewHolder> {

    private List<Alojamiento> alojamientos;

    public AlojamientoAdapter(List<Alojamiento> alojamientos) {
        this.alojamientos = alojamientos;
    }

    @NonNull
    @Override
    public AlojamientoViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_carrusel, parent, false);
        return new AlojamientoViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull AlojamientoViewHolder holder, int position) {
        Alojamiento alojamiento = alojamientos.get(position);

        holder.tvTitulo.setText(alojamiento.getTitulo());
        holder.tvPrecio.setText("$" + alojamiento.getPrecio() + " MXN noche");

        Glide.with(holder.itemView.getContext())
                .load(alojamiento.getImagenUrl())
                .placeholder(android.R.color.darker_gray)
                .into(holder.imgAlojamiento);
    }

    @Override
    public int getItemCount() {
        return alojamientos != null ? alojamientos.size() : 0;
    }

    static class AlojamientoViewHolder extends RecyclerView.ViewHolder {
        ImageView imgAlojamiento;
        TextView tvTitulo, tvPrecio;

        public AlojamientoViewHolder(@NonNull View itemView) {
            super(itemView);
            imgAlojamiento = itemView.findViewById(R.id.imgCarrusel);
            tvTitulo = itemView.findViewById(R.id.title);
            tvPrecio = itemView.findViewById(R.id.subtitle);
        }
    }
}