package com.example.users.controllers;

import com.example.users.dtos.PersonDetailsDTO;
import com.example.users.dtos.PersonLoginDTO;
import com.example.users.dtos.PersonRegisterDTO;
import com.example.users.entities.Person;
import com.example.users.entities.Role;
import com.example.users.handlers.exceptions.model.ResourceNotFoundException;
import com.example.users.services.PersonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping(value = "/secure/person")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @PostMapping()
    public ResponseEntity<UUID> insertProsumer(@Valid @RequestBody PersonDetailsDTO personDTO) {
        UUID personID = personService.insert(personDTO);
        return new ResponseEntity<>(personID, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Person> login(@Valid @RequestBody PersonLoginDTO personLoginDTO) {
       Person user = personService.login(personLoginDTO);
        if(user == null)
            throw new ResourceNotFoundException("User");
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @PostMapping("/register")
    public ResponseEntity register(@Valid @RequestBody PersonRegisterDTO personRegisterDTO) throws Exception {
        personRegisterDTO.setRole(Role.CLIENT);
        Person user = personService.register(personRegisterDTO);
        if(user == null)
            throw new ResourceNotFoundException("User");
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @GetMapping(value = "/getAllClients")
    public ResponseEntity<?> findAllClients(){
        List<Person> clients = personService.getAllClients();
        if(!clients.isEmpty())
            return new ResponseEntity<>(clients, HttpStatus.OK);
        throw new ResourceNotFoundException("Client");
    }

    @GetMapping(value = "/getAllUsers")
    public ResponseEntity<?> findAllUsers(){
        List<Person> users = personService.getAllUsers();
        if(!users.isEmpty())
            return new ResponseEntity<>(users, HttpStatus.OK);
        throw new ResourceNotFoundException("User");
    }
}
