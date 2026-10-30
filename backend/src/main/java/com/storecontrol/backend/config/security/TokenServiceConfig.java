package com.storecontrol.backend.config.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.storecontrol.backend.models.volunteers.Voluntary;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;


@Configuration
@EnableConfigurationProperties(TokenProperties.class)
@RequiredArgsConstructor
public class TokenServiceConfig {

  private final TokenProperties props;

  public String generateToken(Voluntary voluntary) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(props.token().secret());
      return JWT.create()
          .withIssuer(props.issuer())
          .withSubject(voluntary.getUser().getUsername())
          .withClaim("id", voluntary.getUuid().toString())
          .withExpiresAt(dataExpired())
          .sign(algorithm);
    } catch (JWTCreationException exception){
      throw new RuntimeException("error on generate token", exception);
    }
  }

  public UUID recoverVoluntaryUuid(String jwtToken) {
    try {
      return UUID.fromString(
          JWT.require(Algorithm.HMAC256(props.token().secret()))
          .withIssuer(props.issuer())
          .build()
          .verify(jwtToken)
          .getClaim("id").asString());
    } catch (JWTVerificationException exception){
      throw new RuntimeException("Token JWT invalid or expired");
    }
  }

  private Instant dataExpired() {
    return LocalDateTime.now().plusDays(1).toInstant(ZoneOffset.of("-03:00"));
  }
}