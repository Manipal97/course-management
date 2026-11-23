package com.college.cms.model;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Teacher extends BaseEntity {
    @NotBlank private String name;
    @NotBlank @Email private String email;
    private String department;
    private String phone;
}
