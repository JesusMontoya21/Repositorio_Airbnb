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
import com.equipo.airbnb_1.ui.Model.PropertyDetalleResponse;
import com.equipo.airbnb_1.ui.Network.ApiService;
import com.equipo.airbnb_1.ui.Network.RetrofitClient;
import java.util.List;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

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

        // 1. Colocamos el placeholder de carga por defecto
        holder.imgAlojamiento.setImageResource(android.R.drawable.ic_menu_gallery);

        // 2. SOLUCIÓN MAESTRA: Usamos el endpoint del Detalle que SÍ sirve para traer la foto real
        ApiService apiService = RetrofitClient.getApiService(holder.itemView.getContext());
        apiService.obtenerDetalleAlojamiento(alojamiento.getId()).enqueue(new Callback<PropertyDetalleResponse>() {
            @Override
            public void onResponse(@NonNull Call<PropertyDetalleResponse> call, @NonNull Response<PropertyDetalleResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    PropertyDetalleResponse propiedad = response.body();

                    String urlImagen = "https://via.placeholder.com/300";
                    if (propiedad.getImages() != null && !propiedad.getImages().isEmpty()) {
                        urlImagen = propiedad.getImages().get(0).getUrl();
                    }

                    // Log para auditar la ruta exacta del éxito en el carrusel
                    Log.d("GLIDE_EXITO", "Cargando foto real recuperada: " + urlImagen);

                    // Pintamos la foto usando exactamente la misma URL limpia que el fragmento de detalles
                    Glide.with(holder.itemView.getContext())
                            .load(urlImagen)
                            .placeholder(android.R.drawable.ic_menu_gallery)
                            .error(android.R.drawable.ic_dialog_alert)
                            .into(holder.imgAlojamiento);
                }
            }

            @Override
            public void onFailure(@NonNull Call<PropertyDetalleResponse> call, @NonNull Throwable t) {
                Log.e("GLIDE_ERROR", "Fallo al recuperar la imagen: " + t.getMessage());
            }
        });

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