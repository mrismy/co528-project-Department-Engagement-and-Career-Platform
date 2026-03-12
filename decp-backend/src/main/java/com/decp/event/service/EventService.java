package com.decp.event.service;

import com.decp.common.exception.ResourceNotFoundException;
import com.decp.common.util.SecurityUtils;
import com.decp.event.dto.CreateEventRequest;
import com.decp.event.dto.EventResponse;
import com.decp.event.dto.RsvpRequest;
import com.decp.event.entity.Event;
import com.decp.event.entity.EventRsvp;
import com.decp.event.repository.EventRepository;
import com.decp.event.repository.EventRsvpRepository;
import com.decp.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventRsvpRepository eventRsvpRepository;
    private final SecurityUtils securityUtils;

    @Transactional
    public EventResponse createEvent(CreateEventRequest request) {
        User currentUser = securityUtils.getCurrentUser();

        Event event = new Event();
        event.setCreatedBy(currentUser);
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setVenue(request.getVenue());
        event.setEventDate(request.getEventDate());
        event.setEventType(request.getEventType());
        event.setBannerUrl(request.getBannerUrl());

        return mapEvent(eventRepository.save(event), currentUser);
    }

    public List<EventResponse> getAllEvents() {
        User currentUser = securityUtils.getCurrentUser();
        return eventRepository.findAll().stream()
                .sorted((a, b) -> a.getEventDate().compareTo(b.getEventDate()))
                .map(event -> mapEvent(event, currentUser))
                .toList();
    }

    @Transactional
    public EventResponse respondToEvent(Long eventId, RsvpRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        EventRsvp rsvp = eventRsvpRepository.findByEventAndUser(event, currentUser)
                .orElseGet(() -> {
                    EventRsvp newRsvp = new EventRsvp();
                    newRsvp.setEvent(event);
                    newRsvp.setUser(currentUser);
                    return newRsvp;
                });
        rsvp.setStatus(request.getStatus());
        eventRsvpRepository.save(rsvp);
        return mapEvent(event, currentUser);
    }

    private EventResponse mapEvent(Event event, User currentUser) {
        String currentUserRsvp = eventRsvpRepository.findByEventAndUser(event, currentUser)
                .map(r -> r.getStatus().name())
                .orElse(null);

        return EventResponse.builder()
                .id(event.getId())
                .createdById(event.getCreatedBy().getId())
                .createdByName(event.getCreatedBy().getFullName())
                .title(event.getTitle())
                .description(event.getDescription())
                .venue(event.getVenue())
                .eventDate(event.getEventDate())
                .eventType(event.getEventType())
                .bannerUrl(event.getBannerUrl())
                .yesCount(eventRsvpRepository.countByEventAndStatus(event, com.decp.enums.RsvpStatus.YES))
                .noCount(eventRsvpRepository.countByEventAndStatus(event, com.decp.enums.RsvpStatus.NO))
                .maybeCount(eventRsvpRepository.countByEventAndStatus(event, com.decp.enums.RsvpStatus.MAYBE))
                .currentUserRsvp(currentUserRsvp)
                .build();
    }
}
