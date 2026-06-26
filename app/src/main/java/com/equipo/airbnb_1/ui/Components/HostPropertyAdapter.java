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

public class HostPropertyAdapter extends RecyclerView.Adapter<HostPropertyAdapter.HostPropertyViewHolder> {

    private final List<Alojamiento> propiedades;
    private final OnDeleteClickListener onDeleteClickListener;

    public interface OnDeleteClickListener {
        void onDelete(Alojamiento alojamiento);
    }

    public HostPropertyAdapter(List<Alojamiento> propiedades, OnDeleteClickListener onDeleteClickListener) {
        this.propiedades = propiedades;
        this.onDeleteClickListener = onDeleteClickListener;
    }

    @NonNull
    @Override
    public HostPropertyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_host_property, parent, false);
        return new HostPropertyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull HostPropertyViewHolder holder, int position) {
        Alojamiento alojamiento = propiedades.get(position);

        holder.tvTitulo.setText(alojamiento.getTitulo());
        holder.tvPrecio.setText("$" + alojamiento.getPrecio() + " MXN / noche");

        String imageUrl = null;
        if (alojamiento.getImages() != null && !alojamiento.getImages().isEmpty()) {
            imageUrl = alojamiento.getImages().get(0).getUrl();
        }

        Glide.with(holder.itemView.getContext())
                .load(imageUrl)
                .placeholder(android.R.drawable.ic_menu_gallery)
                .error(android.R.drawable.ic_menu_report_image)
                .into(holder.ivPortada);

        holder.tvDelete.setOnClickListener(v -> onDeleteClickListener.onDelete(alojamiento));
    }

    @Override
    public int getItemCount() {
        return propiedades != null ? propiedades.size() : 0;
    }

    static class HostPropertyViewHolder extends RecyclerView.ViewHolder {
        private final ImageView ivPortada;
        private final TextView tvTitulo;
        private final TextView tvPrecio;
        private final TextView tvDelete;

        public HostPropertyViewHolder(@NonNull View itemView) {
            super(itemView);
            ivPortada = itemView.findViewById(R.id.ivHostPropertyImage);
            tvTitulo = itemView.findViewById(R.id.tvHostPropertyTitle);
            tvPrecio = itemView.findViewById(R.id.tvHostPropertyPrice);
            tvDelete = itemView.findViewById(R.id.tvHostDelete);
        }
    }
}