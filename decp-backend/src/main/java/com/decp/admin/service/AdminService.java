package com.decp.admin.service;

import com.decp.common.exception.ResourceNotFoundException;
import com.decp.feed.entity.Post;
import com.decp.feed.repository.CommentRepository;
import com.decp.feed.repository.PostLikeRepository;
import com.decp.feed.repository.PostRepository;
import com.decp.user.entity.User;
import com.decp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommentRepository commentRepository;

    @Transactional
    public String deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(false);
        userRepository.save(user);
        return "User deactivated successfully";
    }

    @Transactional
    public String deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        postLikeRepository.deleteAll(postLikeRepository.findAll().stream().filter(like -> like.getPost().getId().equals(postId)).toList());
        commentRepository.deleteAll(commentRepository.findAll().stream().filter(comment -> comment.getPost().getId().equals(postId)).toList());
        postRepository.delete(post);
        return "Post deleted successfully";
    }
}
