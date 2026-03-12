package com.decp.research.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ResearchProjectResponse {
    private Long id;
    private Long createdById;
    private String createdByName;
    private String title;
    private String description;
    private String documentUrl;
    private String requiredSkills;
    private long memberCount;
    private boolean joinedByCurrentUser;
    private LocalDateTime createdAt;
}
