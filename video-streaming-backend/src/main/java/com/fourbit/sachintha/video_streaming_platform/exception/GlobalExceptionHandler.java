package com.fourbit.sachintha.video_streaming_platform.exception;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.AccountStatusException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {
	private final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(CustomException.class)
	public ProblemDetail handleCustomException(final CustomException e, WebRequest request) {
		ProblemDetail errorDetail = null;
		logger.error(e.getMessage());
		errorDetail = ProblemDetail.forStatusAndDetail(e.getStatus(), e.getMessage());
		errorDetail.setProperty("description", request.getDescription(true));
		return errorDetail;
	}

	// For any Exception
	@ExceptionHandler(Exception.class)
	public ProblemDetail handleGlobalException(Exception e, WebRequest request) {
		ProblemDetail errorDetail = null;
		logger.error(e.getMessage());
		if (e instanceof BadCredentialsException) {
			errorDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(401), e.getMessage());
			errorDetail.setProperty("description", "The username or password is incorrect");

			return errorDetail;
		}

		if (e instanceof AccountStatusException) {
			errorDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(403), e.getMessage());
			errorDetail.setProperty("description", "The account is locked");
		}

		if (e instanceof AccessDeniedException) {
			errorDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(403), e.getMessage());
			errorDetail.setProperty("description", "You are not authorized to access this resource");
		}

		if (e instanceof MethodArgumentNotValidException) {
			errorDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
			MethodArgumentNotValidException ex = (MethodArgumentNotValidException) e;
			errorDetail.setTitle("Validation Error");
			Map<String, String> errors = new HashMap<>();
			ex.getBindingResult().getFieldErrors()
					.forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

			errorDetail.setProperty("errors", errors);
		}
		if (e instanceof DataIntegrityViolationException) {
			errorDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
			DataIntegrityViolationException ex = (DataIntegrityViolationException) e;
			errorDetail.setTitle("Data Error");
			errorDetail.setDetail("A database constraint was violated: " + ex.getMostSpecificCause().getMessage());
			return errorDetail;
		}

		if (errorDetail == null) {
			errorDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(500), e.getMessage());
			errorDetail.setProperty("description", "Unknown internal server error.");
		}
		return errorDetail;
	}
}
