package com.college.cms.controller;

import com.college.cms.model.Course;
import com.college.cms.repository.CourseRepository;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/courses")
public class CourseController extends CrudController<Course> {
    public CourseController(CourseRepository repo) { super(repo); }
}
