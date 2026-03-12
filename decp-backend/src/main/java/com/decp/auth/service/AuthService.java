package com.decp.auth.service;

import com.decp.auth.dto.AuthResponse;
import com.decp.auth.dto.LoginRequest;
import com.decp.auth.dto.RegisterRequest;
import com.decp.common.exception.BadRequestException;
import com.decp.common.exception.ResourceNotFoundException;
import com.decp.common.util.SecurityUtils;
import com.decp.security.JwtService;
import com.decp.user.entity.Profile;
import com.decp.user.entity.User;
import com.decp.user.repository.ProfileRepository;
import com.decp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final SecurityUtils securityUtils;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        Profile profile = new Profile();
        profile.setUser(savedUser);
        profileRepository.save(profile);

        String token = jwtService.generateToken(savedUser.getEmail());
        return toAuthResponse(savedUser, token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = jwtService.generateToken(user.getEmail());
        return toAuthResponse(user, token);
    }

    public AuthResponse me() {
        User user = securityUtils.getCurrentUser();
        return toAuthResponse(user, null);
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
