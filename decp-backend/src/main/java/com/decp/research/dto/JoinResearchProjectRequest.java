package com.decp.research.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinResearchProjectRequest {
    @NotBlank
    private String role;
}
