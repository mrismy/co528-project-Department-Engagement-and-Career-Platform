package com.decp.research.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateResearchProjectRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    private String documentUrl;
    private String requiredSkills;
}
