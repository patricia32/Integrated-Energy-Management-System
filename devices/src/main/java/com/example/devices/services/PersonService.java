package com.example.devices.services;

import com.example.devices.dtos.PersonDTO;
import com.example.devices.dtos.PersonDetailsDTO;
import com.example.devices.dtos.builders.PersonBuilder;
import com.example.devices.entities.Device;
import com.example.devices.entities.Person;
import com.example.devices.handlers.exceptions.model.ResourceNotFoundException;
import com.example.devices.repositories.DeviceRepository;
import com.example.devices.repositories.PersonRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PersonService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonService.class);
    private final PersonRepository personRepository;
    private final DeviceRepository deviceRepository;

    @Autowired
    public PersonService(PersonRepository personRepository, DeviceRepository deviceRepository) {
        this.personRepository = personRepository;
        this.deviceRepository = deviceRepository;
    }

    public List<PersonDTO> findPersons() {
        List<Person> personList = personRepository.findAll();
        return personList.stream()
                .map(PersonBuilder::toPersonDTO)
                .collect(Collectors.toList());
    }

    public PersonDetailsDTO findPersonById(UUID id) {
        Optional<Person> prosumerOptional = personRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Person with id {} was not found in db", id);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + id);
        }
        return PersonBuilder.toPersonDetailsDTO(prosumerOptional.get());
    }

    public UUID insert(PersonDetailsDTO personDTO) {
        Person person = PersonBuilder.toEntity(personDTO);
        person = personRepository.save(person);
        LOGGER.debug("Person with id {} was inserted in db", person.getId());
        return person.getId();
    }

    public Person addClient(UUID idClient){
        return personRepository.save(new Person(idClient));
    }

    public void deleteClient(Person idClient){
        List<Device> devices = deviceRepository.findAllByPerson(idClient);
        for(Device device: devices){
            device.setPerson(null);
            deviceRepository.save(device);
        }
        personRepository.deleteById(idClient.getId());
    }
}
