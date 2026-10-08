package com.Project.EMART.security;

import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** In-memory revocation list for logout. For multi-instance deployments move this to Redis/Mongo with TTL. */
@Component
public class TokenBlacklist {
    private final Map<String, Date> revoked = new ConcurrentHashMap<>();

    public void revoke(String jti, Date expiry) {
        long now = System.currentTimeMillis();
        revoked.values().removeIf(d -> d.getTime() < now);
        revoked.put(jti, expiry);
    }

    public boolean isRevoked(String jti) { return revoked.containsKey(jti); }
}
