package com.decp.event.controller;

import com.decp.event.dto.CreateEventRequest;
import com.decp.event.dto.EventResponse;
import com.decp.event.dto.RsvpRequest;
import com.decp.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public EventResponse create(@Valid @RequestBody CreateEventRequest request) {
        return eventService.createEvent(request);
    }

    @GetMapping
    public List<EventResponse> getAll() {
        return eventService.getAllEvents();
    }

    @PostMapping("/{eventId}/rsvp")
    public EventResponse rsvp(@PathVariable Long eventId, @Valid @RequestBody RsvpRequest request) {
        return eventService.respondToEvent(eventId, request);
    }
}
