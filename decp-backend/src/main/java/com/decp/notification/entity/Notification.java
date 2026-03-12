package com.decp.notification.entity;

import com.decp.common.entity.BaseEntity;
import com.decp.enums.NotificationType;
import com.decp.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "notifications")
@Getter
@Setter
public class Notification extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private String title;

    @Column(length = 1000)
    private String message;

    private Long referenceId;
    private boolean readStatus = false;
}
