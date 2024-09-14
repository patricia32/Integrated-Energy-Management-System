package com.example.devices.dtos.builders;


import com.example.devices.dtos.PersonDTO;
import com.example.devices.dtos.PersonDetailsDTO;
import com.example.devices.entities.Person;

public class PersonBuilder {

    private PersonBuilder() {
    }

    public static PersonDTO toPersonDTO(Person person) {
        return new PersonDTO(person.getId());
    }

    public static PersonDetailsDTO toPersonDetailsDTO(Person person) {
        return new PersonDetailsDTO(person.getId());
    }

    public static Person toEntity(PersonDetailsDTO personDetailsDTO) {
        return new Person(personDetailsDTO.getId());
    }
}
