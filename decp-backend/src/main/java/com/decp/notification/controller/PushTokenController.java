package com.decp.notification.controller;

import com.decp.common.util.SecurityUtils;
import com.decp.user.entity.User;
import com.decp.user.entity.UserPushToken;
import com.decp.user.repository.UserPushTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/push")
@RequiredArgsConstructor
public class PushTokenController {

    private final UserPushTokenRepository pushTokenRepository;
    private final SecurityUtils securityUtils;

    /** Register or update an Expo push token for the current user. */
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String platform = body.getOrDefault("platform", "unknown");
        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "token is required"));
        }

        User user = securityUtils.getCurrentUser();

        // Upsert: if the token already exists (different user re-registering), update owner
        pushTokenRepository.findByToken(token).ifPresentOrElse(
            existing -> {
                existing.setUser(user);
                existing.setPlatform(platform);
                pushTokenRepository.save(existing);
            },
            () -> {
                UserPushToken pt = new UserPushToken();
                pt.setUser(user);
                pt.setToken(token);
                pt.setPlatform(platform);
                pushTokenRepository.save(pt);
            }
        );

        return ResponseEntity.ok(Map.of("status", "registered"));
    }

    /** Remove a push token (called on logout so the user stops receiving pushes). */
    @DeleteMapping("/unregister")
    public ResponseEntity<Void> unregister(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token != null) {
            pushTokenRepository.deleteByToken(token);
        }
        return ResponseEntity.noContent().build();
    }
}
