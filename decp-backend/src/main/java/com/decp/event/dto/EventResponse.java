package com.decp.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class EventResponse {
    private Long id;
    private Long createdById;
    private String createdByName;
    private String title;
    private String description;
    private String venue;
    private LocalDateTime eventDate;
    private String eventType;
    private String bannerUrl;
    private long yesCount;
    private long noCount;
    private long maybeCount;
    private String currentUserRsvp;
}
