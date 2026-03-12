package com.decp.research.repository;

import com.decp.research.entity.ResearchProject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResearchProjectRepository extends JpaRepository<ResearchProject, Long> {
}
