package com.decp.job.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateJobRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String company;
    @NotBlank
    private String description;
    private String location;
    private String type;
    @NotNull
    @FutureOrPresent
    private LocalDate deadline;
}
