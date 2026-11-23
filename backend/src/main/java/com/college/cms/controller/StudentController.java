package com.college.cms.controller;

import com.college.cms.model.Student;
import com.college.cms.repository.StudentRepository;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/students")
public class StudentController extends CrudController<Student> {
    public StudentController(StudentRepository repo) { super(repo); }
}
