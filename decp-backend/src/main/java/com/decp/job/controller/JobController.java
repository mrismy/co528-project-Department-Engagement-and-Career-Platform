package com.decp.job.controller;

import com.decp.job.dto.ApplyJobRequest;
import com.decp.job.dto.CreateJobRequest;
import com.decp.job.dto.JobApplicationResponse;
import com.decp.job.dto.JobResponse;
import com.decp.job.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    public JobResponse create(@Valid @RequestBody CreateJobRequest request) {
        return jobService.createJob(request);
    }

    @GetMapping
    public List<JobResponse> getAll() {
        return jobService.getAllJobs();
    }

    @PostMapping("/{jobId}/apply")
    public JobApplicationResponse apply(@PathVariable Long jobId, @Valid @RequestBody ApplyJobRequest request) {
        return jobService.applyToJob(jobId, request);
    }

    @GetMapping("/my-applications")
    public List<JobApplicationResponse> getMyApplications() {
        return jobService.getMyApplications();
    }
}
