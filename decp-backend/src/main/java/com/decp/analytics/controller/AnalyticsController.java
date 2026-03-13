package com.decp.analytics.controller;

import com.decp.analytics.dto.AnalyticsOverviewResponse;
import com.decp.analytics.dto.TopPostEntry;
import com.decp.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    public AnalyticsOverviewResponse getOverview() {
        return analyticsService.getOverview();
    }

    @GetMapping("/top-posts")
    public List<TopPostEntry> getTopPosts(@RequestParam(defaultValue = "5") int limit) {
        return analyticsService.getTopPosts(limit);
    }
}
