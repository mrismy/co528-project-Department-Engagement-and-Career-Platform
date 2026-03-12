package com.decp.message.repository;

import com.decp.message.entity.Conversation;
import com.decp.message.entity.ConversationParticipant;
import com.decp.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipant, Long> {
    List<ConversationParticipant> findByUser(User user);
    List<ConversationParticipant> findByConversation(Conversation conversation);
    boolean existsByConversationAndUser(Conversation conversation, User user);
}
