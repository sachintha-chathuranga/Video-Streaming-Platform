package com.fourbit.videostreaming.aws_service.dto;

import java.util.List;

public record DeleteFilesRequest(List<String> fileUrls) {

}
