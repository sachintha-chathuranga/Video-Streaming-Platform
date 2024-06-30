package com.fourbit.sachintha.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
  String uploadFile(MultipartFile file, String category);
}
