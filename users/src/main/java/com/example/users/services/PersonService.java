package com.example.users.services;

import com.example.users.entities.Role;
import javassist.bytecode.DuplicateMemberException;
import com.example.users.dtos.*;
import com.example.users.dtos.builders.PersonBuilder;
import com.example.users.entities.Person;
import com.example.users.handlers.exceptions.model.ResourceNotFoundException;
import com.example.users.repositories.PersonRepository;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PersonService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonService.class);
    private final PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public PersonDTO findPersonById(UUID id) {
        Optional<Person> prosumerOptional = personRepository.findById(id);
        if (prosumerOptional.isEmpty())
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + id);
        return PersonBuilder.toPersonDTO(prosumerOptional.get());
    }

    public void deletePersonById(UUID id){
        Optional<Person> person = personRepository.findById(id);
        if(person.isEmpty())
            throw new ResourceNotFoundException("Client");
        personRepository.delete(person.get());
    }
    public UUID insert(PersonDetailsDTO personDTO) {
        Person person = PersonBuilder.toEntity(personDTO);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        person.setPassword(encoder.encode(person.getPassword()));
        person = personRepository.save(person);
        LOGGER.debug("Person with id {} was inserted in db", person.getId());
        return person.getId();
    }

    public Person login(PersonLoginDTO personLoginDTO){
        Person user = personRepository.findByUsernameAndPassword(personLoginDTO.getUsername(), personLoginDTO.getPassword());
        if(user != null)
            return user;
        LOGGER.error("User {} does not exist.", personLoginDTO.getUsername());
        throw new ResourceNotFoundException(Person.class.getSimpleName() + " with username: " + personLoginDTO.getUsername());
    }

    public Person register(PersonRegisterDTO personRegisterDTO) throws DuplicateMemberException {
        if(personRepository.findByUsername(personRegisterDTO.getUsername()).isPresent())
            throw new DuplicateMemberException("Username already exists!");
        Person newPerson = new Person(personRegisterDTO.getUsername(), personRegisterDTO.getPassword(), personRegisterDTO.getAge(), personRegisterDTO.getRole());
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        newPerson.setPassword(encoder.encode(newPerson.getPassword()));
        personRepository.save(newPerson);
        return newPerson;
    }

    public Person editCient(Person person) throws DuplicateMemberException {
        if(personRepository.findByUsername(person.getUsername()).isPresent())
            throw new DuplicateMemberException("Username already exists!");
        return personRepository.save(person);
    }

    public List<Person> getAllUsers(){
        return personRepository.findAll();
    }

    public List<Person> getAllClients(){
        return personRepository.findAllByRole(Role.CLIENT);
    }
}

