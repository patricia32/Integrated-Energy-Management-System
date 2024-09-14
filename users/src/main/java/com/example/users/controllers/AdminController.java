package com.example.users.controllers;


import com.example.users.dtos.AdminDTO;
import com.example.users.dtos.PersonDTO;
import com.example.users.dtos.PersonRegisterDTO;
import com.example.users.entities.Person;
import com.example.users.entities.Role;
import com.example.users.handlers.exceptions.model.ParameterValidationException;
import com.example.users.services.PersonService;
import jakarta.validation.Valid;
import javassist.bytecode.DuplicateMemberException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping(value = "/secure/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    private final PersonService personService;

    @Autowired
    public AdminController(PersonService personService) {
        this.personService = personService;
    }

    @PostMapping("/addClient")
    public ResponseEntity<Person> addClient(@Valid @RequestBody PersonRegisterDTO personRegisterDTO) throws DuplicateMemberException {
        Person person = personService.register(personRegisterDTO);
        return new ResponseEntity<>(person, HttpStatus.OK);
    }

    @PostMapping("/editClient")
    public ResponseEntity editClient(@Valid @RequestBody Person person) throws DuplicateMemberException {
        personService.editCient(person);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/deleteClient/{idAdmin}/{idClient}")
    public ResponseEntity deleteClient(@PathVariable UUID idAdmin, @PathVariable UUID idClient ){
        PersonDTO admin = personService.findPersonById(idAdmin);
        if(admin != null && admin.getRole() == Role.ADMIN) {
            personService.deletePersonById(idClient);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        throw new ParameterValidationException("Not an admin!", new ArrayList<>());
    }

}

