package com.college.cms.controller;

import com.college.cms.repository.*;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/dashboard")
public class DashboardController {
    private final StudentRepository students; private final TeacherRepository teachers; private final CourseRepository courses;

    public DashboardController(StudentRepository s, TeacherRepository t, CourseRepository c) { students = s; teachers = t; courses = c; }

    @GetMapping
    public Map<String, Long> counts() {
        return Map.of("students", students.count(), "teachers", teachers.count(), "courses", courses.count());
    }
}
