package com.decp.research.repository;

import com.decp.research.entity.ResearchMember;
import com.decp.research.entity.ResearchProject;
import com.decp.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResearchMemberRepository extends JpaRepository<ResearchMember, Long> {
    boolean existsByProjectAndUser(ResearchProject project, User user);
    long countByProject(ResearchProject project);
}
