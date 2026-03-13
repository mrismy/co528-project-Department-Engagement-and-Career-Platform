package com.decp.media.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaService {

    @Value("${app.uploads.dir:uploads}")
    private String uploadsDir;

    /**
     * Saves the uploaded file to the local uploads directory.
     * In production, replace this with AWS S3:
     *   s3Client.putObject(PutObjectRequest.builder().bucket(bucket).key(filename).build(), RequestBody.fromBytes(file.getBytes()))
     *   return "https://" + bucket + ".s3.amazonaws.com/" + filename;
     */
    public String store(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadsDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalName = file.getOriginalFilename();
        String extension = (originalName != null && originalName.contains("."))
                ? originalName.substring(originalName.lastIndexOf('.'))
                : "";
        String filename = UUID.randomUUID() + extension;

        Path destination = uploadPath.resolve(filename);
        file.transferTo(destination.toFile());

        return "/api/media/" + filename;
    }
}
