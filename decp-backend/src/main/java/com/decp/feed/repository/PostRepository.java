package com.decp.feed.repository;

import com.decp.feed.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p ORDER BY (SELECT COUNT(pl) FROM PostLike pl WHERE pl.post = p) DESC")
    List<Post> findTopByLikeCount(Pageable pageable);
}
