package com.decp.user.service;

import com.decp.common.util.SecurityUtils;
import com.decp.user.dto.ProfileResponse;
import com.decp.user.dto.UpdateProfileRequest;
import com.decp.user.entity.Profile;
import com.decp.user.entity.User;
import com.decp.user.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final ProfileRepository profileRepository;
    private final SecurityUtils securityUtils;

    public ProfileResponse getMyProfile() {
        User user = securityUtils.getCurrentUser();
        Profile profile = profileRepository.findByUser(user)
                .orElseGet(() -> {
                    Profile newProfile = new Profile();
                    newProfile.setUser(user);
                    return profileRepository.save(newProfile);
                });
        return mapToResponse(user, profile);
    }

    @Transactional
    public ProfileResponse updateMyProfile(UpdateProfileRequest request) {
        User user = securityUtils.getCurrentUser();
        Profile profile = profileRepository.findByUser(user)
                .orElseGet(() -> {
                    Profile newProfile = new Profile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        profile.setProfileImageUrl(request.getProfileImageUrl());
        profile.setBio(request.getBio());
        profile.setDepartment(request.getDepartment());
        profile.setBatch(request.getBatch());
        profile.setGraduationYear(request.getGraduationYear());
        profile.setCurrentCompany(request.getCurrentCompany());
        profile.setJobTitle(request.getJobTitle());
        profile.setSkills(request.getSkills());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setGithubUrl(request.getGithubUrl());

        Profile savedProfile = profileRepository.save(profile);
        return mapToResponse(user, savedProfile);
    }

    private ProfileResponse mapToResponse(User user, Profile profile) {
        return ProfileResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .profileImageUrl(profile.getProfileImageUrl())
                .bio(profile.getBio())
                .department(profile.getDepartment())
                .batch(profile.getBatch())
                .graduationYear(profile.getGraduationYear())
                .currentCompany(profile.getCurrentCompany())
                .jobTitle(profile.getJobTitle())
                .skills(profile.getSkills())
                .linkedinUrl(profile.getLinkedinUrl())
                .githubUrl(profile.getGithubUrl())
                .build();
    }
}
