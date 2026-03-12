package com.decp.analytics.controller;

import com.decp.analytics.dto.AnalyticsOverviewResponse;
import com.decp.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
