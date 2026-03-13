package com.decp.user.repository;

import com.decp.user.entity.User;
import com.decp.user.entity.UserPushToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserPushTokenRepository extends JpaRepository<UserPushToken, Long> {
    List<UserPushToken> findByUser(User user);
    Optional<UserPushToken> findByToken(String token);
    void deleteByToken(String token);
    void deleteByUser(User user);
}
