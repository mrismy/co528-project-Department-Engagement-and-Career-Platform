package com.decp;

import com.decp.auth.dto.RegisterRequest;
import com.decp.auth.service.AuthService;
import com.decp.common.exception.BadRequestException;
import com.decp.common.util.SecurityUtils;
import com.decp.enums.Role;
import com.decp.feed.dto.CreatePostRequest;
import com.decp.feed.service.PostService;
import com.decp.feed.repository.CommentRepository;
import com.decp.feed.repository.PostLikeRepository;
import com.decp.feed.repository.PostRepository;
import com.decp.notification.service.NotificationService;
import com.decp.notification.service.PushNotificationService;
import com.decp.security.JwtService;
import com.decp.user.entity.User;
import com.decp.user.repository.ProfileRepository;
import com.decp.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class DecpUnitTests {

    // ──────────────────────────────────────────────────────────────────────────
    // AuthService unit tests
    // ──────────────────────────────────────────────────────────────────────────

    private UserRepository userRepo;
    private ProfileRepository profileRepo;
    private JwtService jwtService;
    private SecurityUtils securityUtils;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepo        = mock(UserRepository.class);
        profileRepo     = mock(ProfileRepository.class);
        jwtService      = mock(JwtService.class);
        securityUtils   = mock(SecurityUtils.class);

        authService = new AuthService(
                userRepo,
                profileRepo,
                new BCryptPasswordEncoder(),
                mock(AuthenticationManager.class),
                jwtService,
                securityUtils
        );
    }

    @Test
    void register_savesUserAndReturnsToken() {
        when(userRepo.existsByEmail(anyString())).thenReturn(false);

        User saved = new User();
        saved.setId(1L);
        saved.setEmail("test@decp.com");
        saved.setFullName("Test User");
        saved.setRole(Role.STUDENT);
        when(userRepo.save(any())).thenReturn(saved);
        when(profileRepo.save(any())).thenReturn(null);
        when(jwtService.generateToken("test@decp.com")).thenReturn("mock-token");

        RegisterRequest req = new RegisterRequest();
        req.setFullName("Test User");
        req.setEmail("test@decp.com");
        req.setPassword("password123");
        req.setRole(Role.STUDENT);

        var response = authService.register(req);

        assertNotNull(response);
        assertEquals("mock-token", response.getToken());
        assertEquals("test@decp.com", response.getEmail());
        verify(userRepo).save(any());
    }

    @Test
    void register_throwsBadRequest_whenEmailExists() {
        when(userRepo.existsByEmail("dup@decp.com")).thenReturn(true);

        RegisterRequest req = new RegisterRequest();
        req.setEmail("dup@decp.com");
        req.setPassword("pass");
        req.setRole(Role.STUDENT);

        assertThrows(BadRequestException.class, () -> authService.register(req));
        verify(userRepo, never()).save(any());
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PostService validation unit tests
    // ──────────────────────────────────────────────────────────────────────────

    @Test
    void createPost_throwsBadRequest_whenNoContentOrMedia() {
        PostRepository postRepo         = mock(PostRepository.class);
        PostLikeRepository likeRepo     = mock(PostLikeRepository.class);
        CommentRepository commentRepo   = mock(CommentRepository.class);
        NotificationService notifySvc   = mock(NotificationService.class);
        PushNotificationService pushSvc = mock(PushNotificationService.class);

        User current = new User();
        current.setId(1L);
        current.setFullName("Alice");
        when(securityUtils.getCurrentUser()).thenReturn(current);

        PostService postService = new PostService(
                postRepo, likeRepo, commentRepo, securityUtils, notifySvc, pushSvc
        );

        CreatePostRequest empty = new CreatePostRequest();
        // content = null, mediaUrl = null → should throw
        assertThrows(BadRequestException.class, () -> postService.createPost(empty));
    }
}
