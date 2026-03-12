package com.decp.message.entity;

import com.decp.common.entity.BaseEntity;
import com.decp.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "conversation_participants", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"conversation_id", "user_id"})
})
@Getter
@Setter
public class ConversationParticipant extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
