package com.decp.notification.dto;

import com.decp.enums.NotificationType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NotificationResponse {
    private Long id;
    private NotificationType type;
    private String title;
    private String message;
    private Long referenceId;
    private boolean readStatus;
    private LocalDateTime createdAt;
}
