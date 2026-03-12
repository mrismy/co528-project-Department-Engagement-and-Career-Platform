package com.decp.user.dto;

import com.decp.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ProfileResponse {
    private Long userId;
    private String fullName;
    private String email;
    private Role role;
    private String profileImageUrl;
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
