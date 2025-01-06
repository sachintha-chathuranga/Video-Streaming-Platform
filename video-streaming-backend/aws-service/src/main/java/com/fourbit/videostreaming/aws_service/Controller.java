package com.fourbit.videostreaming.aws_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.videostreaming.aws_service.dto.DeleteFilesRequest;
import com.fourbit.videostreaming.aws_service.dto.FileUploadResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class Controller {
	@Autowired
	private final AwsService awsService;

	@PostMapping("/upload")
	public ResponseEntity<FileUploadResponse> uploadFile(@RequestParam("userId") String userId,
			@RequestParam(value = "videoId", required = false) String videoId, @RequestParam("type") String type,
			@RequestParam("file") MultipartFile file) {
		return ResponseEntity.ok(this.awsService.uploadFile(file, type, userId, videoId));
	}

	@DeleteMapping("/delete")
	public ResponseEntity<Boolean> deleteFile(@RequestParam("fileUrl") String fileUrl) {
		return ResponseEntity.ok(this.awsService.deleteFile(fileUrl));
	}

	@PutMapping("/delete")
	public ResponseEntity<Boolean> deleteFiles(@RequestBody DeleteFilesRequest request) {
		return ResponseEntity.ok(this.awsService.deleteFiles(request.fileUrls()));
	}
}
