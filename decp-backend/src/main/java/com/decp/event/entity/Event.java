package com.decp.event.entity;

import com.decp.common.entity.BaseEntity;
import com.decp.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter
@Setter
public class Event extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    private String title;

    @Column(length = 3000)
    private String description;

    private String venue;
    private LocalDateTime eventDate;
    private String eventType;
    private String bannerUrl;
}
