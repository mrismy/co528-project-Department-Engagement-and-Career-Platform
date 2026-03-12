package com.decp.message.entity;

import com.decp.common.entity.BaseEntity;
import com.decp.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "messages")
@Getter
@Setter
public class Message extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(length = 3000, nullable = false)
    private String content;

    private boolean readStatus = false;
}
