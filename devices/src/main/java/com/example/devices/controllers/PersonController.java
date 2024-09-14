package com.example.devices.controllers;

import com.example.devices.dtos.PersonDetailsDTO;
import com.example.devices.entities.Device;
import com.example.devices.entities.Person;
import com.example.devices.services.DeviceService;
import com.example.devices.services.PersonService;
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
    private final DeviceService deviceService;

    @Autowired
    public PersonController(PersonService personService, DeviceService deviceService) {
        this.personService = personService;
        this.deviceService = deviceService;
    }

    @PostMapping()
    public ResponseEntity<UUID> insertProsumer(@Valid @RequestBody PersonDetailsDTO personDTO) {
        UUID personID = personService.insert(personDTO);
        return new ResponseEntity<>(personID, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<PersonDetailsDTO> getPerson(@PathVariable("id") UUID personId) {
        PersonDetailsDTO dto = personService.findPersonById(personId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PostMapping(value = "/addClient")
    public ResponseEntity<Person> addClient(@Valid @RequestBody String personId) {
        UUID uuid = UUID.fromString(String.valueOf(personId.substring(0, personId.length()-1)));
        Person client = personService.addClient(uuid);
        return new ResponseEntity<>(client, HttpStatus.OK);
    }

    @GetMapping(value = "/getUserDevices/{idUser}")
    public ResponseEntity<List<Device>> getUserDevices(@PathVariable("idUser") String personId) {
        UUID uuid = UUID.fromString(personId);
        Person person = new Person(uuid);
        List<Device> devices = deviceService.getUserDevices(person);
        return new ResponseEntity<>(devices, HttpStatus.OK);
    }

    @DeleteMapping(value = "/deleteClient/{idClient}")
    public ResponseEntity deleteClient(@PathVariable("idClient") String personId){
        UUID uuid = UUID.fromString(personId);
        Person person = new Person(uuid);
        personService.deleteClient(person);
        return new ResponseEntity(HttpStatus.OK);
    }
}
