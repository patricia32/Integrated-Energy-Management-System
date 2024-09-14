package com.example.users.repositories;
import com.example.users.entities.Person;
import com.example.users.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PersonRepository extends JpaRepository<Person, UUID> {
    Optional<Person> findByUsername(String username);
    Person findByUsernameAndPassword(String username, String password);
    List<Person> findAllByRole(Role role);
    List<Person> findAll();

}
