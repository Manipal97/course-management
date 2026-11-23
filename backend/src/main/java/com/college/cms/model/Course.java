package com.college.cms.model;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Course extends BaseEntity {
    @NotBlank private String code;
    @NotBlank private String title;
    @Min(1) @Max(10) private Integer credits;
    private String department;
    private String instructor;
}
