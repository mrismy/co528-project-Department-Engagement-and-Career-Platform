package com.decp.message.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateConversationRequest {
    private String type;
    private String title;
    @NotEmpty
    private List<Long> participantIds;
}
