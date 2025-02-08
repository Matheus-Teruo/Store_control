package com.storecontrol.backend.services.stands;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class S3Service {

  @Value("${aws.s3.bucket}")
  private String bucket;

  @Value("${aws.s3.url.prefix}")
  private String prefix;

  @Value("${aws.s3.url.suffix}")
  private String suffix;

  @Autowired
  S3Client s3Client;

  public File adjustNameFile(MultipartFile file) throws IOException {
    String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss"));
    String fileExtension = ".tmp";
    if (file.getOriginalFilename() != null && file.getOriginalFilename().contains(".")) {
      String[] parts = file.getOriginalFilename().split("\\.");
      fileExtension = "." + parts[1];
    }

    return File.createTempFile("product-" + date + "-", fileExtension);
  }

  public String uploadFile(File file, String key) {
    PutObjectRequest request = PutObjectRequest.builder()
        .bucket(bucket)
        .key(key)
        .build();

    s3Client.putObject(request, Paths.get(file.getAbsolutePath()));

    return prefix + bucket + suffix + key;
  }
}
