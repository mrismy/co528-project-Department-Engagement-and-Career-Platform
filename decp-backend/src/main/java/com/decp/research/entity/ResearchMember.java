package com.decp.research.entity;

import com.decp.common.entity.BaseEntity;
import com.decp.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "research_members", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"project_id", "user_id"})
})
@Getter
@Setter
public class ResearchMember extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private ResearchProject project;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String role;

    private String status;
}
