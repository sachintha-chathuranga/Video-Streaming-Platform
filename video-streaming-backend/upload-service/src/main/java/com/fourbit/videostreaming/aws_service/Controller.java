package com.fourbit.videostreaming.aws_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class Controller {
	@Autowired
	private final AwsService awsService;

	@PostMapping("/upload/{id}")
	public ResponseEntity<String> uploadFile(@PathVariable("id") String userId, @RequestParam("type") String type,
			@RequestParam("file") MultipartFile file) {
		return ResponseEntity.ok(this.awsService.uploadFile(file, type, userId));
	}

	@DeleteMapping("/delete")
	public ResponseEntity<Boolean> deleteFile(@RequestParam("fileUrl") String fileUrl) {
		return ResponseEntity.ok(this.awsService.deleteFile(fileUrl));
	}
}
