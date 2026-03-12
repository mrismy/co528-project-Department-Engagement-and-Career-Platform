package com.decp.analytics.service;

import com.decp.analytics.dto.AnalyticsOverviewResponse;
import com.decp.event.repository.EventRepository;
import com.decp.event.repository.EventRsvpRepository;
import com.decp.feed.repository.PostRepository;
import com.decp.job.repository.JobApplicationRepository;
import com.decp.job.repository.JobRepository;
import com.decp.message.repository.ConversationRepository;
import com.decp.notification.repository.NotificationRepository;
import com.decp.research.repository.ResearchProjectRepository;
import com.decp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final EventRepository eventRepository;
    private final EventRsvpRepository eventRsvpRepository;
    private final ResearchProjectRepository researchProjectRepository;
    private final ConversationRepository conversationRepository;
    private final NotificationRepository notificationRepository;

    public AnalyticsOverviewResponse getOverview() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream().filter(user -> user.isActive()).count();

        return AnalyticsOverviewResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalPosts(postRepository.count())
                .totalJobs(jobRepository.count())
                .totalApplications(jobApplicationRepository.count())
                .totalEvents(eventRepository.count())
                .totalRsvps(eventRsvpRepository.count())
                .totalResearchProjects(researchProjectRepository.count())
                .totalConversations(conversationRepository.count())
                .totalNotifications(notificationRepository.count())
                .build();
    }
}
