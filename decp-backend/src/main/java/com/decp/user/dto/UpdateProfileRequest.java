package com.decp.user.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {
    private String fullName;
    private String profileImageUrl;

    @Size(max = 1000)
    private String bio;

    private String department;
    private String batch;
    private Integer graduationYear;
    private String currentCompany;
    private String jobTitle;
    private String skills;
    private String linkedinUrl;
    private String githubUrl;
}
