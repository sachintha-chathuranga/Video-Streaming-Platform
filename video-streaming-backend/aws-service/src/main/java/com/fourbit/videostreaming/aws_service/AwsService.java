package com.fourbit.videostreaming.aws_service;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import com.fourbit.videostreaming.aws_service.dto.CreateVideoResponse;
import com.fourbit.videostreaming.aws_service.dto.FileUploadResponse;
import com.fourbit.videostreaming.aws_service.dto.UserUpdateResponse;
import com.fourbit.videostreaming.aws_service.dto.VideoUpdateResponse;

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
public class AwsService {

	private final Logger logger = LoggerFactory.getLogger(AwsService.class);

	@Value("${aws.bucket.name}")
	private String awsBucketName;

	@Value("${spring.cloud.aws.s3.region}")
	private String awsBucketRegion;

	private final S3Client awsS3Client;

	@Autowired
	private final WebClient.Builder webClientBuilder;

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

	public FileUploadResponse uploadFile(MultipartFile file, String category, String userId, String videoId) {
		FileUploadResponse response = null;
		// create unique name for file
		logger.info("Invoke UploadFile function");

		var fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
		var key = userId + "/" + category + "/" + UUID.randomUUID().toString() + '.' + fileExtension;
		logger.info("objectKey: " + key);

		try {
			// upload to AWS S3 bucket
			PutObjectRequest putObj = PutObjectRequest.builder().bucket(awsBucketName).key(key)
					.contentType(file.getContentType()).contentLength(file.getSize()).build();
			awsS3Client.putObject(putObj, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

			// set the public access to the file
			PutObjectAclRequest aclRequest = PutObjectAclRequest.builder().bucket(awsBucketName).key(key)
					.acl(ObjectCannedACL.PUBLIC_READ).build();
			logger.info("File uploading....");
			awsS3Client.putObjectAcl(aclRequest);
			logger.info("File uploaded successfuly");

		} catch (Exception e) {
			throw new CustomException("Error while upload file to AWS S3 bucket", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		String fileUrl = this.genarateS3Url(awsBucketRegion, awsBucketName, key);
		if (category.equals("profile_photoes")) {
			Map<String, String> requestBody = Map.of("pictureUrl", fileUrl);
			logger.info("send Update User Request");
			UserUpdateResponse res = this.webClientBuilder.baseUrl("http://localhost:8082").build().put()
					.uri(uriBuilder -> uriBuilder.path("/api/users/update").queryParam("userId", userId).build())
					.bodyValue(requestBody).retrieve().bodyToMono(UserUpdateResponse.class).block();
			logger.info("profileUrl: " + res.getPictureUrl());
			if (res.getPictureUrl() != null && !res.getPictureUrl().equals(fileUrl)) {
				logger.info("Call deleteFile function");
				this.deleteFile(res.getPictureUrl());
			}
			response = res;

		} else if (category.equals("videos")) {
			Map<String, String> requestBody = Map.of("videoUrl", fileUrl, "fileName", file.getOriginalFilename());
			logger.info("send Creat video Request");
			CreateVideoResponse res = this.webClientBuilder.baseUrl("http://localhost:8083").build().post()
					.uri(uriBuilder -> uriBuilder.path("/api/videos/create").queryParam("userId", userId).build())
					.bodyValue(requestBody).retrieve().bodyToMono(CreateVideoResponse.class).block();
			response = res;

		} else if (category.equals("thumbnails")) {
			Map<String, String> requestBody = Map.of("thumbnailUrl", fileUrl);
			logger.info("send Update Video Request");
			logger.info("VideoId: " + videoId);
			VideoUpdateResponse res = this.webClientBuilder.baseUrl("http://localhost:8083").build().put()
					.uri(uriBuilder -> uriBuilder.path("/api/videos/" + videoId + "/update")
							.queryParam("userId", userId).build())
					.bodyValue(requestBody).retrieve().bodyToMono(VideoUpdateResponse.class).block();
			logger.info("thumbnail: " + res.getThumbnailUrl());
			if (res.getThumbnailUrl() != null && !res.getThumbnailUrl().equals(fileUrl)) {
				logger.info("Call deleteFile function");
				this.deleteFile(res.getThumbnailUrl());
			}
			response = res;
		}
		return response;
	}

	public boolean deleteFile(String s3Url) {
		try {
			String objectKey = this.getObjectKeyFromUrl(s3Url);
			DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder().bucket(awsBucketName).key(objectKey)
					.build();
			logger.info("file deleting...");
			awsS3Client.deleteObject(deleteRequest);
			return true;
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
