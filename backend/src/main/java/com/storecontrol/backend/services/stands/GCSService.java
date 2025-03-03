package com.storecontrol.backend.services.stands;

import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class GCSService {

  @Value("${gcp.storage.bucket}")
  private String bucket;

  @Value("${gcp.storage.url.prefix}")
  private String prefix;

  @Value("${gcp.storage.url.suffix}")
  private String suffix;

  @Autowired
  private Storage storage;

  public File adjustNameFile(MultipartFile file) throws IOException {
    String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss"));
    String fileExtension = ".tmp";
    if (file.getOriginalFilename() != null && file.getOriginalFilename().contains(".")) {
      String[] parts = file.getOriginalFilename().split("\\.");
      fileExtension = "." + parts[1];
    }

    return File.createTempFile("product-" + date + "-", fileExtension);
  }

  public String uploadFile(File file, String key) throws IOException {
    BlobInfo blobInfo = BlobInfo.newBuilder(bucket, key).build();
    storage.create(blobInfo, Files.readAllBytes(Paths.get(file.getAbsolutePath())));

    return prefix + bucket + suffix + key;
  }
}
