package com.example.users;

import com.example.users.entities.Person;
import com.example.users.entities.Role;
import com.example.users.repositories.PersonRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class UsersApplication {

   private final PasswordEncoder passwordEncoder;

    public UsersApplication(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public static void main(String[] args) {
        SpringApplication.run(UsersApplication.class, args);
    }


    @Bean
    CommandLineRunner init(PersonRepository personRepository) {
        return args -> {
            Person client = new Person("ioana", passwordEncoder.encode("PASS"), 22, Role.CLIENT);
            Person admin = new Person("admin", passwordEncoder.encode("PASS"), 22, Role.ADMIN);

            personRepository.save(client);
            personRepository.save(admin);
        };
    }

}