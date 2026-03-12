package com.decp.message.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MessageResponse {
    private Long id;
    private Long senderId;
    private String senderName;
    private String content;
    private boolean readStatus;
    private LocalDateTime createdAt;
}
