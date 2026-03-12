package com.decp.feed.dto;

import com.decp.enums.MediaType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String content;
    private String mediaUrl;
    private MediaType mediaType;
    private Long sharedPostId;
    private int likeCount;
    private int commentCount;
    private boolean likedByCurrentUser;
    private LocalDateTime createdAt;
    private List<CommentResponse> comments;
}
