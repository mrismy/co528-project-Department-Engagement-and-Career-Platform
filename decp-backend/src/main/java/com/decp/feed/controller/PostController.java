package com.decp.feed.controller;

import com.decp.feed.dto.CommentResponse;
import com.decp.feed.dto.CreateCommentRequest;
import com.decp.feed.dto.CreatePostRequest;
import com.decp.feed.dto.PostResponse;
import com.decp.feed.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public PostResponse createPost(@RequestBody CreatePostRequest request) {
        return postService.createPost(request);
    }

    @GetMapping
    public List<PostResponse> getAllPosts() {
        return postService.getAllPosts();
    }

    @PostMapping("/{postId}/like")
    public PostResponse toggleLike(@PathVariable Long postId) {
        return postService.toggleLike(postId);
    }

    @PostMapping("/{postId}/comments")
    public CommentResponse addComment(@PathVariable Long postId, @Valid @RequestBody CreateCommentRequest request) {
        return postService.addComment(postId, request);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }
}
