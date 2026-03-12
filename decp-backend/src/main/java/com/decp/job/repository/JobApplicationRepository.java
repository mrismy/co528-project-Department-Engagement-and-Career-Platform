package com.decp.job.repository;

import com.decp.job.entity.Job;
import com.decp.job.entity.JobApplication;
import com.decp.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    boolean existsByJobAndApplicant(Job job, User applicant);
    long countByJob(Job job);
    List<JobApplication> findByApplicantOrderByCreatedAtDesc(User applicant);
}
