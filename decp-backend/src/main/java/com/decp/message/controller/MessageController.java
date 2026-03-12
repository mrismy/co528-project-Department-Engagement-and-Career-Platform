package com.decp.message.controller;

import com.decp.message.dto.ConversationResponse;
import com.decp.message.dto.CreateConversationRequest;
import com.decp.message.dto.MessageResponse;
import com.decp.message.dto.SendMessageRequest;
import com.decp.message.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ConversationResponse createConversation(@Valid @RequestBody CreateConversationRequest request) {
        return messageService.createConversation(request);
    }

    @GetMapping
    public List<ConversationResponse> getMyConversations() {
        return messageService.getMyConversations();
    }

    @GetMapping("/{conversationId}/messages")
    public List<MessageResponse> getMessages(@PathVariable Long conversationId) {
        return messageService.getMessages(conversationId);
    }

    @PostMapping("/{conversationId}/messages")
    public MessageResponse sendMessage(@PathVariable Long conversationId, @Valid @RequestBody SendMessageRequest request) {
        return messageService.sendMessage(conversationId, request);
    }
}
