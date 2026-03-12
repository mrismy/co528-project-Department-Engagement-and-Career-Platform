package com.decp.notification.service;

import com.decp.common.exception.ResourceNotFoundException;
import com.decp.common.util.SecurityUtils;
import com.decp.enums.NotificationType;
import com.decp.notification.dto.NotificationResponse;
import com.decp.notification.entity.Notification;
import com.decp.notification.repository.NotificationRepository;
import com.decp.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SecurityUtils securityUtils;

    public void create(User user, NotificationType type, String title, String message, Long referenceId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setReferenceId(referenceId);
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getMyNotifications() {
        User currentUser = securityUtils.getCurrentUser();
        return notificationRepository.findByUserOrderByCreatedAtDesc(currentUser).stream()
                .map(this::map)
                .toList();
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId) {
        User currentUser = securityUtils.getCurrentUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }

        notification.setReadStatus(true);
        return map(notificationRepository.save(notification));
    }

    private NotificationResponse map(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .referenceId(notification.getReferenceId())
                .readStatus(notification.isReadStatus())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
