package com.elp.usuarios_service.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class CloudinaryProfileService {
    private final Cloudinary cloudinary;

    public CloudinaryProfileService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName, "api_key", apiKey, "api_secret", apiSecret, "secure", true));
    }

    public String subirCv(MultipartFile file, UUID usuarioId) throws IOException {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("Debes seleccionar un archivo PDF");
        if (file.getSize() > 5L * 1024 * 1024) throw new IllegalArgumentException("El CV no puede superar los 5 MB");
        String contentType = file.getContentType();
        String nombre = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        if (!"application/pdf".equalsIgnoreCase(contentType) && !nombre.endsWith(".pdf")) {
            throw new IllegalArgumentException("Solo se permiten archivos PDF");
        }
        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "resource_type", "raw", "folder", "cvs_perfiles",
                "public_id", "cv_" + usuarioId + "_" + UUID.randomUUID()));
        Object url = result.get("secure_url");
        if (url == null) throw new IOException("Cloudinary no devolvió la URL del CV");
        log.info("CV del usuario {} subido correctamente a Cloudinary", usuarioId);
        return url.toString();
    }
}
