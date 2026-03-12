package com.decp.message.entity;

import com.decp.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "conversations")
@Getter
@Setter
public class Conversation extends BaseEntity {
    @Column(nullable = false)
    private String type;

    private String title;
}
