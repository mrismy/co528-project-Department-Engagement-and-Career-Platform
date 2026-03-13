package com.decp.analytics.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TopPostEntry {
    private Long postId;
    private String authorName;
    private String content;
    private int likeCount;
    private LocalDateTime createdAt;
}
