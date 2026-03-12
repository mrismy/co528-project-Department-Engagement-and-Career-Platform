package com.decp.user.controller;

import com.decp.user.dto.ProfileResponse;
import com.decp.user.dto.UpdateProfileRequest;
import com.decp.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ProfileResponse getMyProfile() {
        return userService.getMyProfile();
    }

    @PutMapping("/profile")
    public ProfileResponse updateMyProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateMyProfile(request);
    }
}
