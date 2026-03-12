package com.decp.research.controller;

import com.decp.research.dto.CreateResearchProjectRequest;
import com.decp.research.dto.JoinResearchProjectRequest;
import com.decp.research.dto.ResearchProjectResponse;
import com.decp.research.service.ResearchProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/research-projects")
@RequiredArgsConstructor
public class ResearchProjectController {

    private final ResearchProjectService researchProjectService;

    @PostMapping
    public ResearchProjectResponse create(@Valid @RequestBody CreateResearchProjectRequest request) {
        return researchProjectService.create(request);
    }

    @GetMapping
    public List<ResearchProjectResponse> getAll() {
        return researchProjectService.getAll();
    }

    @PostMapping("/{projectId}/join")
    public ResearchProjectResponse join(@PathVariable Long projectId, @Valid @RequestBody JoinResearchProjectRequest request) {
        return researchProjectService.join(projectId, request);
    }
}
