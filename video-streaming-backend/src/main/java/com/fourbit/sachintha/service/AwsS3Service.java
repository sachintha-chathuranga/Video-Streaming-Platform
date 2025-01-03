package com.fourbit.sachintha.service;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.exception.CustomException;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.Delete;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectsRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;
import software.amazon.awssdk.services.s3.model.PutObjectAclRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
public class AwsS3Service {
	@Value("${aws.bucket.name}")
	private String awsBucketName;
	@Value("${spring.cloud.aws.s3.region}")
	private String awsBucketRegion;

	private final S3Client awsS3Client;

	public String genarateS3Url(String region, String bucketName, String key) {
		return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
	}

	public String getObjectKeyFromUrl(String s3Url) {
		try {
			if (s3Url == null) {
				return null;
			}
			URI uri = new URI(s3Url);
			String path = uri.getPath();
			if (path.startsWith("/")) {
				path = path.substring(1); // Remove leading slash
			}
			return path;
		} catch (URISyntaxException e) {
			return null;
		}
	}

	public String uploadFile(MultipartFile file, String category) {
		// create unique name for file
		var fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
		var key = category + "/" + UUID.randomUUID().toString() + '.' + fileExtension;

		try {
			// upload to AWS S3 bucket
			PutObjectRequest putObj = PutObjectRequest.builder().bucket(awsBucketName).key(key)
					.contentType(file.getContentType()).contentLength(file.getSize()).build();
			awsS3Client.putObject(putObj, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

			// set the public access to the file
			PutObjectAclRequest aclRequest = PutObjectAclRequest.builder().bucket(awsBucketName).key(key)
					.acl(ObjectCannedACL.PUBLIC_READ).build();
			awsS3Client.putObjectAcl(aclRequest);
		} catch (Exception e) {
			throw new CustomException("Error while upload file to AWS S3 bucket", HttpStatus.INTERNAL_SERVER_ERROR);
		}

		// get url of the uploaded file
		return this.genarateS3Url(awsBucketRegion, awsBucketName, key);
	}

	public void deleteFile(String s3Url) {
		try {
			String objectKey = this.getObjectKeyFromUrl(s3Url);
			DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder().bucket(awsBucketName).key(objectKey)
					.build();
			awsS3Client.deleteObject(deleteRequest);
		} catch (Exception e) {
			System.out.println("Error : " + e.getMessage());
			throw new CustomException("Error while delete file from AWS S3 bucket", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public void deleteFiles(List<String> fileUrls) {
		List<ObjectIdentifier> objects = fileUrls.stream()
				.map(s3Url -> ObjectIdentifier.builder().key(this.getObjectKeyFromUrl(s3Url)).build())
				.collect(Collectors.toList());

		Delete delete = Delete.builder().objects(objects).build();

		DeleteObjectsRequest request = DeleteObjectsRequest.builder().bucket(awsBucketName).delete(delete).build();

		awsS3Client.deleteObjects(request);
	}
}
