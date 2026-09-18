package com.elp.usuarios_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.UUID;

/** Cliente de Supabase Auth. Las credenciales nunca se guardan en PostgreSQL. */
@Component
@RequiredArgsConstructor
public class SupabaseAuthClient {
    private final RestClient.Builder restClientBuilder;
    @Value("${supabase.url:}") private String url;
    @Value("${supabase.anon-key:}") private String anonKey;
    @Value("${supabase.service-role-key:}") private String serviceRoleKey;

    public Session login(String email, String password) {
        requireConfigured();
        Map<?, ?> body = client().post().uri(url + "/auth/v1/token?grant_type=password")
                .header("apikey", anonKey).contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("email", email, "password", password)).retrieve().body(Map.class);
        Map<?, ?> user = (Map<?, ?>) body.get("user");
        return new Session((String) body.get("access_token"), UUID.fromString((String) user.get("id")));
    }

    public UUID createUser(String email, String password, String phone) {
        requireConfigured();
        Map<String, Object> request = new java.util.HashMap<>();
        request.put("email", email); request.put("password", password); request.put("email_confirm", true);
        if (phone != null && !phone.isBlank()) { request.put("phone", phone); request.put("phone_confirm", true); }
        Map<?, ?> body = client().post().uri(url + "/auth/v1/admin/users")
                .header("apikey", serviceRoleKey).header(HttpHeaders.AUTHORIZATION, "Bearer " + serviceRoleKey)
                .contentType(MediaType.APPLICATION_JSON).body(request).retrieve().body(Map.class);
        return UUID.fromString((String) body.get("id"));
    }

    public void updatePhone(UUID authUserId, String phone) {
        requireConfigured();
        client().put().uri(url + "/auth/v1/admin/users/" + authUserId)
                .header("apikey", serviceRoleKey).header(HttpHeaders.AUTHORIZATION, "Bearer " + serviceRoleKey)
                .contentType(MediaType.APPLICATION_JSON).body(Map.of("phone", phone, "phone_confirm", true))
                .retrieve().toBodilessEntity();
    }

    private RestClient client() { return restClientBuilder.build(); }
    private void requireConfigured() {
        if (url.isBlank() || anonKey.isBlank() || serviceRoleKey.isBlank())
            throw new IllegalStateException("Configure supabase.url, supabase.anon-key y supabase.service-role-key");
    }
    public record Session(String accessToken, UUID authUserId) {}
}
