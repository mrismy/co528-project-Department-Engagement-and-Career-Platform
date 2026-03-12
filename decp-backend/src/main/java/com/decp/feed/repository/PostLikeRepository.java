package com.decp.feed.repository;

import com.decp.feed.entity.Post;
import com.decp.feed.entity.PostLike;
import com.decp.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    boolean existsByPostAndUser(Post post, User user);
    long countByPost(Post post);
    void deleteByPostAndUser(Post post, User user);
}
