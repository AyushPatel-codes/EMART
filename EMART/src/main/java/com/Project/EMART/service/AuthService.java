package com.Project.EMART.service;

import com.Project.EMART.model.User;
import com.Project.EMART.repository.UserRepository;
import com.Project.EMART.security.JWTUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JWTUtils jwtUtils;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ResponseEntity<Map<String, Object>> register(User user) {
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email Already Exists!!"));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("Customer");
        user.setBlocked(false);

        User savedUser = userRepository.save(user);
        String token = jwtUtils.generateToken(savedUser.getEmail(), savedUser.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user",savedUser);

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> login(String email, String password) {
        User user = userRepository.findByEmail(email).orElse(null);

        Map<String, Object> response = new HashMap<>();

        if(user == null || !passwordEncoder.matches(password, user.getPassword())) {
            response.put("message", "Invalid Password");
            return ResponseEntity.status(401).body(response);
        }

        if(user.isBlocked()) {
            response.put("message", "User is Blocked");
            return ResponseEntity.status(403).body(response);
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole());
        response.put("token", token);
        response.put("user",user);

        return ResponseEntity.ok(response);
    }
}
