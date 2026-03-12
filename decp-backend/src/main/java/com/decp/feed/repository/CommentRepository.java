package com.decp.feed.repository;

import com.decp.feed.entity.Comment;
import com.decp.feed.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    long countByPost(Post post);
    List<Comment> findByPostOrderByCreatedAtAsc(Post post);
}
