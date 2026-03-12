package com.decp.job.service;

import com.decp.common.exception.BadRequestException;
import com.decp.common.exception.ResourceNotFoundException;
import com.decp.common.util.SecurityUtils;
import com.decp.enums.NotificationType;
import com.decp.enums.Role;
import com.decp.job.dto.ApplyJobRequest;
import com.decp.job.dto.CreateJobRequest;
import com.decp.job.dto.JobApplicationResponse;
import com.decp.job.dto.JobResponse;
import com.decp.job.entity.Job;
import com.decp.job.entity.JobApplication;
import com.decp.job.repository.JobApplicationRepository;
import com.decp.job.repository.JobRepository;
import com.decp.notification.service.NotificationService;
import com.decp.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final SecurityUtils securityUtils;
    private final NotificationService notificationService;

    @Transactional
    public JobResponse createJob(CreateJobRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        if (currentUser.getRole() == Role.STUDENT) {
            throw new BadRequestException("Students cannot post jobs");
        }

        Job job = new Job();
        job.setPostedBy(currentUser);
        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setType(request.getType());
        job.setDeadline(request.getDeadline());

        return mapJob(jobRepository.save(job));
    }

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapJob)
                .toList();
    }

    @Transactional
    public JobApplicationResponse applyToJob(Long jobId, ApplyJobRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (jobApplicationRepository.existsByJobAndApplicant(job, currentUser)) {
            throw new BadRequestException("You have already applied to this job");
        }

        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setApplicant(currentUser);
        application.setResumeUrl(request.getResumeUrl());
        application.setCoverLetter(request.getCoverLetter());
        JobApplication saved = jobApplicationRepository.save(application);

        if (!job.getPostedBy().getId().equals(currentUser.getId())) {
            notificationService.create(job.getPostedBy(), NotificationType.APPLICATION_UPDATE,
                    "New job application", currentUser.getFullName() + " applied for " + job.getTitle(), job.getId());
        }

        return mapApplication(saved);
    }

    public List<JobApplicationResponse> getMyApplications() {
        User currentUser = securityUtils.getCurrentUser();
        return jobApplicationRepository.findByApplicantOrderByCreatedAtDesc(currentUser)
                .stream().map(this::mapApplication).toList();
    }

    private JobResponse mapJob(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .postedById(job.getPostedBy().getId())
                .postedByName(job.getPostedBy().getFullName())
                .title(job.getTitle())
                .company(job.getCompany())
                .description(job.getDescription())
                .location(job.getLocation())
                .type(job.getType())
                .deadline(job.getDeadline())
                .createdAt(job.getCreatedAt())
                .applicationCount(jobApplicationRepository.countByJob(job))
                .build();
    }

    private JobApplicationResponse mapApplication(JobApplication application) {
        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .applicantId(application.getApplicant().getId())
                .applicantName(application.getApplicant().getFullName())
                .resumeUrl(application.getResumeUrl())
                .coverLetter(application.getCoverLetter())
                .status(application.getStatus())
                .appliedAt(application.getCreatedAt())
                .build();
    }
}
