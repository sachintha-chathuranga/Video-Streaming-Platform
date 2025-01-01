package com.fourbit.videostreaming.config;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fourbit.videostreaming.dto.VideoCardDto;

public class PageDeserializer extends JsonDeserializer<Page<VideoCardDto>> {

	@Override
	public Page<VideoCardDto> deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
		ObjectMapper objectMapper = (ObjectMapper) p.getCodec();
		// Parse the response as a JSON node
		JsonNode node = p.getCodec().readTree(p);

		// Deserialize the list of items
		List<VideoCardDto> content = objectMapper.readValue(node.get("content").traverse(),
				objectMapper.getTypeFactory().constructCollectionType(List.class, VideoCardDto.class));

		// Deserialize the pagination metadata
		int totalElements = node.get("totalElements").asInt();
		int totalPages = node.get("totalPages").asInt();
		int pageNumber = node.get("number").asInt();
		int pageSize = node.get("size").asInt();

		// Create a Pageable object (if needed)
		Pageable pageable = Pageable.ofSize(pageSize).withPage(pageNumber);

		// Return a PageImpl object with the content and pagination metadata
		return new PageImpl<>(content, pageable, totalElements);
	}
}