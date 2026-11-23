package com.college.cms.controller;

import com.college.cms.model.User;
import com.college.cms.repository.UserRepository;
import com.college.cms.security.JwtUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    record RegisterRequest(@NotBlank String name, @NotBlank @Email String email, @Size(min = 6, message = "must be at least 6 characters") String password) {}
    record LoginRequest(@NotBlank String email, @NotBlank String password) {}
    record AuthResponse(String token, String name, String email, String role) {}
    record Me(String name, String email, String role, String provider) {}

    private final UserRepository users; private final PasswordEncoder encoder; private final JwtUtil jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtUtil jwt) {
        this.users = users; this.encoder = encoder; this.jwt = jwt;
    }

    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest r) {
        if (users.existsByEmail(r.email())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        User u = new User();
        u.setName(r.name()); u.setEmail(r.email());
        u.setPassword(encoder.encode(r.password()));
        u.setProvider("LOCAL");
        u.setRole(users.count() == 0 ? "ADMIN" : "USER");   // first account becomes admin
        users.save(u);
        return new AuthResponse(jwt.generate(u.getEmail(), u.getRole()), u.getName(), u.getEmail(), u.getRole());
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest r) {
        User u = users.findByEmail(r.email()).orElse(null);
        if (u == null || u.getPassword() == null || !encoder.matches(r.password(), u.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        return new AuthResponse(jwt.generate(u.getEmail(), u.getRole()), u.getName(), u.getEmail(), u.getRole());
    }

    @GetMapping("/me")
    public Me me(Authentication auth) {
        User u = users.findByEmail(auth.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return new Me(u.getName(), u.getEmail(), u.getRole(), u.getProvider());
    }
}
