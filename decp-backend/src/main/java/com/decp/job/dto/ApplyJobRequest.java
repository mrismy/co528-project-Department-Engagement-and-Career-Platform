package com.decp.job.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplyJobRequest {
    @NotBlank
    private String resumeUrl;
    private String coverLetter;
}
