package com.fourbit.sachintha.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.service.VideoService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {
  private final VideoService videoService;

  @PostMapping
  public ResponseEntity<String> uploadVideo(@RequestParam("file") MultipartFile file) {
    System.out.println(file.getOriginalFilename());
    String url = videoService.uploadVideo(file);
    return ResponseEntity.ok(url);
  }
}
