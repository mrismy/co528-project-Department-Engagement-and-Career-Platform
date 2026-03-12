package com.decp.message.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ConversationResponse {
    private Long id;
    private String type;
    private String title;
    private List<String> participantNames;
    private String lastMessagePreview;
    private LocalDateTime updatedAt;
}
