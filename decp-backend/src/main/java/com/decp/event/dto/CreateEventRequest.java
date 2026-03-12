package com.decp.event.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateEventRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    private String venue;
    @NotNull
    @Future
    private LocalDateTime eventDate;
    private String eventType;
    private String bannerUrl;
}
