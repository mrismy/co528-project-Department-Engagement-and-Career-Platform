package com.decp.feed.entity;

import com.decp.common.entity.BaseEntity;
import com.decp.enums.MediaType;
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
@Table(name = "posts")
@Getter
@Setter
public class Post extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 3000)
    private String content;

    private String mediaUrl;

    @Enumerated(EnumType.STRING)
    private MediaType mediaType = MediaType.NONE;

    @ManyToOne
    @JoinColumn(name = "shared_post_id")
    private Post sharedPost;
}
