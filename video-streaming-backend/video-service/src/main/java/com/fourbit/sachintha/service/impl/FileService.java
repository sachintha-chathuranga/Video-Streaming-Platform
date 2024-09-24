package com.fourbit.sachintha.service.impl;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
  String uploadFile(MultipartFile file, String category);

  void deleteFile(String key);
}
