package com.decp.research.service;

import com.decp.common.exception.BadRequestException;
import com.decp.common.exception.ResourceNotFoundException;
import com.decp.common.util.SecurityUtils;
import com.decp.enums.NotificationType;
import com.decp.notification.service.NotificationService;
import com.decp.research.dto.CreateResearchProjectRequest;
import com.decp.research.dto.JoinResearchProjectRequest;
import com.decp.research.dto.ResearchProjectResponse;
import com.decp.research.entity.ResearchMember;
import com.decp.research.entity.ResearchProject;
import com.decp.research.repository.ResearchMemberRepository;
import com.decp.research.repository.ResearchProjectRepository;
import com.decp.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResearchProjectService {

    private final ResearchProjectRepository researchProjectRepository;
    private final ResearchMemberRepository researchMemberRepository;
    private final SecurityUtils securityUtils;
    private final NotificationService notificationService;

    @Transactional
    public ResearchProjectResponse create(CreateResearchProjectRequest request) {
        User currentUser = securityUtils.getCurrentUser();

        ResearchProject project = new ResearchProject();
        project.setCreatedBy(currentUser);
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setDocumentUrl(request.getDocumentUrl());
        project.setRequiredSkills(request.getRequiredSkills());

        ResearchProject saved = researchProjectRepository.save(project);

        ResearchMember owner = new ResearchMember();
        owner.setProject(saved);
        owner.setUser(currentUser);
        owner.setRole("OWNER");
        owner.setStatus("APPROVED");
        researchMemberRepository.save(owner);

        return map(saved, currentUser);
    }

    public List<ResearchProjectResponse> getAll() {
        User currentUser = securityUtils.getCurrentUser();
        return researchProjectRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(project -> map(project, currentUser))
                .toList();
    }

    @Transactional
    public ResearchProjectResponse join(Long projectId, JoinResearchProjectRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        ResearchProject project = researchProjectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Research project not found"));

        if (researchMemberRepository.existsByProjectAndUser(project, currentUser)) {
            throw new BadRequestException("You have already joined this research project");
        }

        ResearchMember member = new ResearchMember();
        member.setProject(project);
        member.setUser(currentUser);
        member.setRole(request.getRole());
        member.setStatus("APPROVED");
        researchMemberRepository.save(member);

        if (!project.getCreatedBy().getId().equals(currentUser.getId())) {
            notificationService.create(project.getCreatedBy(), NotificationType.ANNOUNCEMENT,
                    "New collaborator", currentUser.getFullName() + " joined your research project", project.getId());
        }

        return map(project, currentUser);
    }

    private ResearchProjectResponse map(ResearchProject project, User currentUser) {
        return ResearchProjectResponse.builder()
                .id(project.getId())
                .createdById(project.getCreatedBy().getId())
                .createdByName(project.getCreatedBy().getFullName())
                .title(project.getTitle())
                .description(project.getDescription())
                .documentUrl(project.getDocumentUrl())
                .requiredSkills(project.getRequiredSkills())
                .memberCount(researchMemberRepository.countByProject(project))
                .joinedByCurrentUser(researchMemberRepository.existsByProjectAndUser(project, currentUser))
                .createdAt(project.getCreatedAt())
                .build();
    }
}
