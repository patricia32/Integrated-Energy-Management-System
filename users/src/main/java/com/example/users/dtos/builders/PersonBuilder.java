package com.example.users.dtos.builders;


import com.example.users.dtos.PersonDTO;
import com.example.users.dtos.PersonDetailsDTO;
import com.example.users.entities.Person;

public class PersonBuilder {

    private PersonBuilder() {
    }

    public static PersonDTO toPersonDTO(Person person) {
        return new PersonDTO(person.getId(), person.getRole());
    }

    public static Person toEntity(PersonDetailsDTO personDetailsDTO) {
        return new Person(personDetailsDTO.getUsername(),
                personDetailsDTO.getPassword(),
                personDetailsDTO.getAge(),
                personDetailsDTO.getRole());
    }
}
