package com.decp.research.entity;

import com.decp.common.entity.BaseEntity;
import com.decp.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "research_projects")
@Getter
@Setter
public class ResearchProject extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(nullable = false)
    private String title;

    @Column(length = 3000, nullable = false)
    private String description;

    private String documentUrl;

    @Column(length = 1000)
    private String requiredSkills;
}
