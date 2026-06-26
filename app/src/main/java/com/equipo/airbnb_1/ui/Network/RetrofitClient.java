package com.equipo.airbnb_1.ui.Network;

import android.content.Context;
import android.content.SharedPreferences;
import java.util.concurrent.TimeUnit;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitClient {

    private static Retrofit retrofit = null;
    //private static final String BASE_URL = "http://192.168.1.26:8001/api/";
    private static final String BASE_URL = "http://10.0.2.2:80/api/";

    public static ApiService getApiService(Context context) {
        if (retrofit == null) {
            OkHttpClient okHttpClient = new OkHttpClient.Builder()
                    .connectTimeout(15, TimeUnit.SECONDS)
                    .readTimeout(15, TimeUnit.SECONDS)
                    .writeTimeout(15, TimeUnit.SECONDS)
                    .addInterceptor(chain -> {
                        SharedPreferences preferences = context.getSharedPreferences("user_session", Context.MODE_PRIVATE);
                        String token = preferences.getString("auth_token", null);

                        Request.Builder requestBuilder = chain.request().newBuilder();
                        if (token != null) {
                            requestBuilder.addHeader("Authorization", "Bearer " + token);
                        }
                        return chain.proceed(requestBuilder.build());
                    })
                    .build();

            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .client(okHttpClient)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit.create(ApiService.class);
    }
}