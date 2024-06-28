package com.fourbit.sachintha.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectAclRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
public class AwsS3Service implements FileService {
  @Value("${aws.bucket.name}")
  private String awsBucketName;
  @Value("${spring.cloud.aws.s3.region}")
  private String awsBucketRegion;

  private final S3Client awsS3Client;

  @Override
  public String uploadFile(MultipartFile file, String category) {
    // create unique name for file
    var fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
    var key = category + "/" + UUID.randomUUID().toString() + '.' + fileExtension;

    try {
      // upload to AWS S3 bucket
      PutObjectRequest putOb = PutObjectRequest.builder()
          .bucket(awsBucketName)
          .key(key)
          .contentType(file.getContentType())
          .contentLength(file.getSize())
          .build();
      awsS3Client.putObject(putOb, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

      // set the public access to the file
      PutObjectAclRequest aclRequest = PutObjectAclRequest.builder()
          .bucket(awsBucketName)
          .key(key)
          .acl(ObjectCannedACL.PUBLIC_READ)
          .build();
      awsS3Client.putObjectAcl(aclRequest);
    } catch (Exception e) {
      System.out.println("Error : " + e.getMessage());
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    // get url of the uploaded file
    return getUrl(awsBucketRegion, awsBucketName, key);
  }

  private String getUrl(String region, String bucketName, String key) {
    return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
  }
}
