package com.college.cms.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity @Table(name = "users")
@Getter @Setter
public class User extends BaseEntity {
    private String name;
    @Column(unique = true, nullable = false)
    private String email;
    private String password;   // null for OAuth users
    private String role;       // ADMIN or USER
    private String provider;   // LOCAL or GOOGLE
}
