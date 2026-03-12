package com.decp.event.dto;

import com.decp.enums.RsvpStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RsvpRequest {
    @NotNull
    private RsvpStatus status;
}
