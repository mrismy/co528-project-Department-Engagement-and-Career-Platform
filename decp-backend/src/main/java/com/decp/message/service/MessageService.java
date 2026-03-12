package com.decp.message.service;

import com.decp.common.exception.BadRequestException;
import com.decp.common.exception.ResourceNotFoundException;
import com.decp.common.util.SecurityUtils;
import com.decp.enums.NotificationType;
import com.decp.message.dto.ConversationResponse;
import com.decp.message.dto.CreateConversationRequest;
import com.decp.message.dto.MessageResponse;
import com.decp.message.dto.SendMessageRequest;
import com.decp.message.entity.Conversation;
import com.decp.message.entity.ConversationParticipant;
import com.decp.message.entity.Message;
import com.decp.message.repository.ConversationParticipantRepository;
import com.decp.message.repository.ConversationRepository;
import com.decp.message.repository.MessageRepository;
import com.decp.notification.service.NotificationService;
import com.decp.user.entity.User;
import com.decp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final NotificationService notificationService;

    @Transactional
    public ConversationResponse createConversation(CreateConversationRequest request) {
        User currentUser = securityUtils.getCurrentUser();

        Conversation conversation = new Conversation();
        conversation.setType(request.getType() == null || request.getType().isBlank() ? "DIRECT" : request.getType());
        conversation.setTitle(request.getTitle());
        Conversation savedConversation = conversationRepository.save(conversation);

        List<Long> uniqueParticipantIds = new ArrayList<>(request.getParticipantIds());
        if (!uniqueParticipantIds.contains(currentUser.getId())) {
            uniqueParticipantIds.add(currentUser.getId());
        }

        for (Long participantId : uniqueParticipantIds) {
            User participant = userRepository.findById(participantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Participant not found: " + participantId));
            ConversationParticipant cp = new ConversationParticipant();
            cp.setConversation(savedConversation);
            cp.setUser(participant);
            participantRepository.save(cp);
        }

        return mapConversation(savedConversation);
    }

    public List<ConversationResponse> getMyConversations() {
        User currentUser = securityUtils.getCurrentUser();
        return participantRepository.findByUser(currentUser).stream()
                .map(ConversationParticipant::getConversation)
                .distinct()
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .map(this::mapConversation)
                .toList();
    }

    public List<MessageResponse> getMessages(Long conversationId) {
        Conversation conversation = getAuthorizedConversation(conversationId);
        return messageRepository.findByConversationOrderByCreatedAtAsc(conversation).stream()
                .map(this::mapMessage)
                .toList();
    }

    @Transactional
    public MessageResponse sendMessage(Long conversationId, SendMessageRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        Conversation conversation = getAuthorizedConversation(conversationId);

        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new BadRequestException("Message content cannot be empty");
        }

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(currentUser);
        message.setContent(request.getContent());
        Message saved = messageRepository.save(message);

        participantRepository.findByConversation(conversation).stream()
                .map(ConversationParticipant::getUser)
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .forEach(user -> notificationService.create(user, NotificationType.MESSAGE,
                        "New message", currentUser.getFullName() + " sent you a message", conversation.getId()));

        return mapMessage(saved);
    }

    private Conversation getAuthorizedConversation(Long conversationId) {
        User currentUser = securityUtils.getCurrentUser();
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        if (!participantRepository.existsByConversationAndUser(conversation, currentUser)) {
            throw new BadRequestException("You are not a participant of this conversation");
        }
        return conversation;
    }

    private ConversationResponse mapConversation(Conversation conversation) {
        List<String> participantNames = participantRepository.findByConversation(conversation).stream()
                .map(cp -> cp.getUser().getFullName())
                .toList();
        Message lastMessage = messageRepository.findTopByConversationOrderByCreatedAtDesc(conversation);

        return ConversationResponse.builder()
                .id(conversation.getId())
                .type(conversation.getType())
                .title(conversation.getTitle())
                .participantNames(participantNames)
                .lastMessagePreview(lastMessage != null ? lastMessage.getContent() : null)
                .updatedAt(conversation.getUpdatedAt())
                .build();
    }

    private MessageResponse mapMessage(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFullName())
                .content(message.getContent())
                .readStatus(message.isReadStatus())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
