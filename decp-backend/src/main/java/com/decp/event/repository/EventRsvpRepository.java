package com.decp.event.repository;

import com.decp.enums.RsvpStatus;
import com.decp.event.entity.Event;
import com.decp.event.entity.EventRsvp;
import com.decp.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventRsvpRepository extends JpaRepository<EventRsvp, Long> {
    Optional<EventRsvp> findByEventAndUser(Event event, User user);
    long countByEventAndStatus(Event event, RsvpStatus status);
}
