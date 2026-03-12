package com.decp.user.entity;

import com.decp.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "profiles")
@Getter
@Setter
public class Profile extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String profileImageUrl;

    @Column(length = 1000)
    private String bio;

    private String department;
    private String batch;
    private Integer graduationYear;
    private String currentCompany;
    private String jobTitle;

    @Column(length = 1000)
    private String skills;

    private String linkedinUrl;
    private String githubUrl;
}
