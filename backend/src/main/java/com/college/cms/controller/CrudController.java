package com.college.cms.controller;

import com.college.cms.model.BaseEntity;
import jakarta.validation.Valid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/** Generic CRUD. GET needs a login; POST/PUT/DELETE need ADMIN (see SecurityConfig). */
public abstract class CrudController<T extends BaseEntity> {
    private final JpaRepository<T, Long> repo;

    protected CrudController(JpaRepository<T, Long> repo) { this.repo = repo; }

    @GetMapping
    public List<T> all() { return repo.findAll(); }

    @GetMapping("/{id}")
    public T one(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found"));
    }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public T create(@Valid @RequestBody T body) { body.setId(null); return repo.save(body); }

    @PutMapping("/{id}")
    public T update(@PathVariable Long id, @Valid @RequestBody T body) {
        one(id); body.setId(id); return repo.save(body);
    }

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { one(id); repo.deleteById(id); }
}
