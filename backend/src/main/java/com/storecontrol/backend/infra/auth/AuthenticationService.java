package com.storecontrol.backend.infra.auth;

import com.storecontrol.backend.repositories.volunteers.VoluntaryRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService implements UserDetailsService {

  private final VoluntaryRepository repository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    UserDetails userDetails = repository.findByUserUsername(username);

    if (userDetails == null) {
        throw new UsernameNotFoundException("Usuário não encontrado");
    }

    return userDetails;
  }
}
