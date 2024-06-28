package com.fourbit.sachintha.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.service.VideoService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

@RestController
@RequestMapping("/api/video")
@RequiredArgsConstructor
public class VideoController {
  private final VideoService videoService;

  @PostMapping("/upload-video")
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseEntity<String> uploadVideo(@RequestParam("file") MultipartFile file) {
    String url = videoService.uploadVideo(file);
    return ResponseEntity.ok(url);
  }

  @PutMapping("/update-details")
  @ResponseStatus(HttpStatus.OK)
  public ResponseEntity<VideoDto> updateVideoDetails(@RequestBody VideoDto videoDto) {
    VideoDto savedVideo = videoService.updateVideoMetaData(videoDto);
    return ResponseEntity.ok(savedVideo);
  }
}
