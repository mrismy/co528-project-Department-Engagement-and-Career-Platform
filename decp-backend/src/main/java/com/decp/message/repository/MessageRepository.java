package com.decp.message.repository;

import com.decp.message.entity.Conversation;
import com.decp.message.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationOrderByCreatedAtAsc(Conversation conversation);
    Message findTopByConversationOrderByCreatedAtDesc(Conversation conversation);
}
