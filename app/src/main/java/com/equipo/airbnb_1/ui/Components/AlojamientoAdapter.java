package com.equipo.airbnb_1.ui.Components;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.equipo.airbnb_1.R;
import com.equipo.airbnb_1.ui.Model.Alojamiento;
import java.util.List;

public class AlojamientoAdapter extends RecyclerView.Adapter<AlojamientoAdapter.AlojamientoViewHolder> {

    private List<Alojamiento> listaAlojamientos;

    public AlojamientoAdapter(List<Alojamiento> listaAlojamientos) {
        this.listaAlojamientos = listaAlojamientos;
    }

    @NonNull
    @Override
    public AlojamientoViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_carrusel, parent, false);
        return new AlojamientoViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull AlojamientoViewHolder holder, int position) {
        Alojamiento alojamiento = listaAlojamientos.get(position);

        holder.tvTitulo.setText(alojamiento.getTitulo());
        holder.tvPrecio.setText("$" + alojamiento.getPrecio() + " MXN por noche");

        String urlImagen = "";

        if (alojamiento.getImages() != null && !alojamiento.getImages().isEmpty()) {
            String urlReal = alojamiento.getImages().get(0).getUrl();

            if (urlReal != null && !urlReal.isEmpty()) {
                if (!urlReal.startsWith("http")) {

                    if (!urlReal.startsWith("storage/") && !urlReal.startsWith("/storage/")) {
                        urlImagen = "http://192.168.1.26:8000/storage/" + urlReal;
                    } else {
                        urlImagen = "http://192.168.1.26:8000/" + urlReal;
                    }

                } else {
                    urlImagen = urlReal;
                }
            }
        }

        Log.d("GLIDE_BASE_DATOS", "Alojamiento: " + alojamiento.getTitulo() + " -> Ruta armada: " + urlImagen);

        Glide.with(holder.itemView.getContext())
                .load(urlImagen.isEmpty() ? null : urlImagen)
                .placeholder(android.R.drawable.ic_menu_gallery)
                .error(android.R.drawable.ic_dialog_alert)
                .into(holder.imgAlojamiento);

        holder.itemView.setOnClickListener(v -> {
            Bundle bundle = new Bundle();
            bundle.putInt("alojamiento_id", alojamiento.getId());

            Navigation.findNavController(v).navigate(R.id.action_homeFragment_to_detalleAlojamientoFragment, bundle);
        });
    }

    @Override
    public int getItemCount() {
        return listaAlojamientos != null ? listaAlojamientos.size() : 0;
    }

    public static class AlojamientoViewHolder extends RecyclerView.ViewHolder {
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