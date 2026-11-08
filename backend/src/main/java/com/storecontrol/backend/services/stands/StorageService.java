package com.storecontrol.backend.services.stands;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.storecontrol.backend.config.storage.S3ClientProperties;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StorageService {

  private final S3Client s3Client;
  private final S3Presigner presigner;
  private final S3ClientProperties props;

  public String uploadImageFile(MultipartFile file, UUID userUuid, String fileName) {
    String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss"));
    try {
        String key = String.format(
            "product/%s/image/%s",
            userUuid,
            fileName + "-" + date);

        PutObjectRequest request = PutObjectRequest.builder()
            .bucket(props.bucket())
            .key(key)
            .contentType(file.getContentType())
            .contentLength(file.getSize())
            .build();

        s3Client.putObject(
            request,
            RequestBody.fromInputStream(
                file.getInputStream(),
                file.getSize()
            )
        );

        return key;

    } catch (IOException e) {
        throw new IllegalStateException("Failed to upload document to S3", e);
    }
  }

  public String generatePublicUrl(String key) {

    if (key == null) return null;

    return s3Client.utilities()
        .getUrl(r -> r
            .bucket(props.bucket())
            .key(key))
        .toString();
  }

  public void deleteFile(String key) {
    DeleteObjectRequest request = DeleteObjectRequest
        .builder()
        .bucket(props.bucket())
        .key(key)
        .build();

    s3Client.deleteObject(request);
  }
}
