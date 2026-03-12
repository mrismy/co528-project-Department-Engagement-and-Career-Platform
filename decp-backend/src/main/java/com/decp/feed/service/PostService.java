package com.decp.feed.service;

import com.decp.common.exception.BadRequestException;
import com.decp.common.exception.ResourceNotFoundException;
import com.decp.common.util.SecurityUtils;
import com.decp.enums.NotificationType;
import com.decp.feed.dto.CommentResponse;
import com.decp.feed.dto.CreateCommentRequest;
import com.decp.feed.dto.CreatePostRequest;
import com.decp.feed.dto.PostResponse;
import com.decp.feed.entity.Comment;
import com.decp.feed.entity.Post;
import com.decp.feed.entity.PostLike;
import com.decp.feed.repository.CommentRepository;
import com.decp.feed.repository.PostLikeRepository;
import com.decp.feed.repository.PostRepository;
import com.decp.notification.service.NotificationService;
import com.decp.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommentRepository commentRepository;
    private final SecurityUtils securityUtils;
    private final NotificationService notificationService;

    @Transactional
    public PostResponse createPost(CreatePostRequest request) {
        if ((request.getContent() == null || request.getContent().isBlank()) && (request.getMediaUrl() == null || request.getMediaUrl().isBlank())) {
            throw new BadRequestException("Post must contain text or media");
        }

        User currentUser = securityUtils.getCurrentUser();
        Post post = new Post();
        post.setUser(currentUser);
        post.setContent(request.getContent());
        post.setMediaUrl(request.getMediaUrl());
        post.setMediaType(request.getMediaType());

        if (request.getSharedPostId() != null) {
            Post sharedPost = postRepository.findById(request.getSharedPostId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shared post not found"));
            post.setSharedPost(sharedPost);
        }

        Post saved = postRepository.save(post);
        return mapToResponse(saved, currentUser, true);
    }

    public List<PostResponse> getAllPosts() {
        User currentUser = securityUtils.getCurrentUser();
        return postRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(post -> mapToResponse(post, currentUser, false))
                .toList();
    }

    @Transactional
    public PostResponse toggleLike(Long postId) {
        User currentUser = securityUtils.getCurrentUser();
        Post post = getPost(postId);

        if (postLikeRepository.existsByPostAndUser(post, currentUser)) {
            postLikeRepository.deleteByPostAndUser(post, currentUser);
        } else {
            PostLike like = new PostLike();
            like.setPost(post);
            like.setUser(currentUser);
            postLikeRepository.save(like);
            if (!post.getUser().getId().equals(currentUser.getId())) {
                notificationService.create(post.getUser(), NotificationType.LIKE,
                        "New like", currentUser.getFullName() + " liked your post", post.getId());
            }
        }
        return mapToResponse(post, currentUser, false);
    }

    @Transactional
    public CommentResponse addComment(Long postId, CreateCommentRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        Post post = getPost(postId);

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(currentUser);
        comment.setContent(request.getContent());
        Comment saved = commentRepository.save(comment);

        if (!post.getUser().getId().equals(currentUser.getId())) {
            notificationService.create(post.getUser(), NotificationType.COMMENT,
                    "New comment", currentUser.getFullName() + " commented on your post", post.getId());
        }

        return mapComment(saved);
    }

    private Post getPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
    }

    private PostResponse mapToResponse(Post post, User currentUser, boolean includeComments) {
        List<CommentResponse> comments = includeComments
                ? commentRepository.findByPostOrderByCreatedAtAsc(post).stream().map(this::mapComment).toList()
                : null;

        return PostResponse.builder()
                .id(post.getId())
                .userId(post.getUser().getId())
                .userName(post.getUser().getFullName())
                .content(post.getContent())
                .mediaUrl(post.getMediaUrl())
                .mediaType(post.getMediaType())
                .sharedPostId(post.getSharedPost() != null ? post.getSharedPost().getId() : null)
                .likeCount((int) postLikeRepository.countByPost(post))
                .commentCount((int) commentRepository.countByPost(post))
                .likedByCurrentUser(postLikeRepository.existsByPostAndUser(post, currentUser))
                .createdAt(post.getCreatedAt())
                .comments(comments)
                .build();
    }

    private CommentResponse mapComment(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .userId(comment.getUser().getId())
                .userName(comment.getUser().getFullName())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
