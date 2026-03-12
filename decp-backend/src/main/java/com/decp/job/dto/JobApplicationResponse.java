package com.decp.job.dto;

import com.decp.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class JobApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long applicantId;
    private String applicantName;
    private String resumeUrl;
    private String coverLetter;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}
