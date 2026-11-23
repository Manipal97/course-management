package com.college.cms.model;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Student extends BaseEntity {
    @NotBlank private String name;
    @NotBlank @Email private String email;
    @NotBlank private String rollNo;
    private String department;
    @Min(1) @Max(8) private Integer semester;
}
