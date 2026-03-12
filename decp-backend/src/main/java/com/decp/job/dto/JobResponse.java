package com.decp.job.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class JobResponse {
    private Long id;
    private Long postedById;
    private String postedByName;
    private String title;
    private String company;
    private String description;
    private String location;
    private String type;
    private LocalDate deadline;
    private LocalDateTime createdAt;
    private long applicationCount;
}
