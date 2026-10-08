package com.Project.EMART.security;

import com.Project.EMART.model.Role;
import com.Project.EMART.model.UserStatus;
import com.Project.EMART.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

/** Validates the Bearer token on every request and re-checks the account in the DB (so suspensions apply instantly). */
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwt;
    private final UserRepository users;
    private final TokenBlacklist blacklist;
    private final String adminEmail;

    public JwtAuthFilter(JwtUtil jwt, UserRepository users, TokenBlacklist blacklist, String adminEmail) {
        this.jwt = jwt; this.users = users; this.blacklist = blacklist; this.adminEmail = adminEmail;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                Claims c = jwt.parse(header.substring(7));
                if (!blacklist.isRevoked(c.getId())) {
                    String role = c.get("role", String.class);
                    String id = c.getSubject();
                    String email = c.get("email", String.class);
                    boolean ok;
                    if (Role.ROLE_ADMIN.name().equals(role)) {
                        ok = "admin".equals(id) && adminEmail.equalsIgnoreCase(email);
                    } else {
                        ok = users.findById(id)
                                .filter(u -> u.getRole().name().equals(role))
                                .filter(u -> u.getStatus() != UserStatus.SUSPENDED && u.getStatus() != UserStatus.REJECTED)
                                .isPresent();
                    }
                    if (ok) {
                        var auth = new UsernamePasswordAuthenticationToken(new AuthUser(id, email, role), null,
                                List.of(new SimpleGrantedAuthority(role)));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            } catch (JwtException | IllegalArgumentException ignored) {
                // invalid/expired token -> request stays unauthenticated -> 401
            }
        }
        chain.doFilter(req, res);
    }
}
