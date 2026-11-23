package com.college.cms.controller;

import com.college.cms.model.Teacher;
import com.college.cms.repository.TeacherRepository;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/teachers")
public class TeacherController extends CrudController<Teacher> {
    public TeacherController(TeacherRepository repo) { super(repo); }
}
