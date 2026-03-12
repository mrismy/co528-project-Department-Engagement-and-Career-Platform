package com.decp.feed.dto;

import com.decp.enums.MediaType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePostRequest {
    private String content;
    private String mediaUrl;
    private MediaType mediaType = MediaType.NONE;
    private Long sharedPostId;
}
