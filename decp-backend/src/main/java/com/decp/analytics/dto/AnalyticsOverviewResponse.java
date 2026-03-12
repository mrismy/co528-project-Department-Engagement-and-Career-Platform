package com.decp.analytics.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AnalyticsOverviewResponse {
    private long totalUsers;
    private long activeUsers;
    private long totalPosts;
    private long totalJobs;
    private long totalApplications;
    private long totalEvents;
    private long totalRsvps;
    private long totalResearchProjects;
    private long totalConversations;
    private long totalNotifications;
}
