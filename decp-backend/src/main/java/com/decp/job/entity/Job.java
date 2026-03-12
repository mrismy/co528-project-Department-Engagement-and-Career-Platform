package com.decp.job.entity;

import com.decp.common.entity.BaseEntity;
import com.decp.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "jobs")
@Getter
@Setter
public class Job extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "posted_by", nullable = false)
    private User postedBy;

    private String title;
    private String company;

    @Column(length = 3000)
    private String description;

    private String location;
    private String type;
    private LocalDate deadline;
}
