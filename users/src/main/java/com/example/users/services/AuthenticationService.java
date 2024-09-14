package com.example.users.services;

import com.example.users.controllers.components.AuthenticationRequest;
import com.example.users.controllers.components.AuthenticationResponse;
import com.example.users.controllers.components.RegisterRequest;
import com.example.users.entities.Person;
import com.example.users.entities.Role;
import com.example.users.repositories.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final PersonRepository personRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var person = Person.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(Role.CLIENT)
            .age(request.getAge())
            .build();
        personRepository.save(person);

        var jwtToken = jwtService.generateToken(person);
        return AuthenticationResponse.builder()
            .token(jwtToken)
            .role("CLIENT")
            .id(person.getId())
            .username(person.getUsername())
            .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        System.out.println(request.getUsername() + " " + request.getPassword());
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
            request.getUsername(),
            request.getPassword()
        ));
        var person = personRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        var jwtToken = jwtService.generateToken(person);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .id(person.getId())
                .role(person.getRole().toString())
                .username(person.getUsername())
                .build();
    }
}
