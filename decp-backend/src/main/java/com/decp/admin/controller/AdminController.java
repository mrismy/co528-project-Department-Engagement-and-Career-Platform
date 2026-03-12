package com.decp.admin.controller;

import com.decp.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminController {

    private final AdminService adminService;

    @PutMapping("/users/{id}/deactivate")
    public Map<String, String> deactivateUser(@PathVariable Long id) {
        return Map.of("message", adminService.deactivateUser(id));
    }

    @DeleteMapping("/posts/{id}")
    public Map<String, String> deletePost(@PathVariable Long id) {
        return Map.of("message", adminService.deletePost(id));
    }
}
