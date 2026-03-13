package com.decp.notification.service;

import com.decp.user.entity.User;
import com.decp.user.entity.UserPushToken;
import com.decp.user.repository.UserPushTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Sends push notifications via the Expo Push API.
 * Docs: https://docs.expo.dev/push-notifications/sending-notifications/
 *
 * In production, consider using a queue (e.g. RabbitMQ / SQS) to handle
 * large fan-outs instead of synchronous HTTP calls.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PushNotificationService {

    private final UserPushTokenRepository pushTokenRepository;
    private final RestTemplate restTemplate;

    @Value("${app.expo.push-url:https://exp.host/--/api/v2/push/send}")
    private String expoPushUrl;

    /**
     * Sends a push notification to all registered tokens for a user.
     * Silently ignores failures so that the calling operation is not affected.
     */
    public void sendToUser(User user, String title, String body) {
        List<UserPushToken> tokens = pushTokenRepository.findByUser(user);
        if (tokens.isEmpty()) return;

        for (UserPushToken pt : tokens) {
            try {
                Map<String, Object> payload = Map.of(
                        "to", pt.getToken(),
                        "title", title,
                        "body", body,
                        "sound", "default"
                );
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
                restTemplate.postForObject(expoPushUrl, request, String.class);
            } catch (Exception e) {
                log.warn("Failed to send push notification to token {}: {}", pt.getToken(), e.getMessage());
            }
        }
    }
}
