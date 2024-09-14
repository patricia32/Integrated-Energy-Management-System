package com.example.devices.controllers;

import com.example.devices.dtos.DeviceNewDTO;
import com.example.devices.entities.Device;
import com.example.devices.handlers.exceptions.model.ResourceNotFoundException;
import com.example.devices.services.DeviceService;
import com.example.devices.services.PersonService;
import jakarta.validation.Valid;
import javassist.bytecode.DuplicateMemberException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeoutException;

@RestController
@CrossOrigin
@RequestMapping(value = "/secure/device")
public class DeviceController {
    private final PersonService personService;
    private final DeviceService deviceService;

    @Autowired
    public DeviceController(PersonService personService, DeviceService deviceService) {
        this.personService = personService;
        this.deviceService = deviceService;
    }

    @PostMapping("/addDevice")
    public ResponseEntity addDevice(@Valid @RequestBody DeviceNewDTO deviceNewDTO) throws DuplicateMemberException, URISyntaxException, NoSuchAlgorithmException, IOException, KeyManagementException, TimeoutException {
        deviceService.addDevice(deviceNewDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/editDevice")
    public ResponseEntity editDevice(@Valid @RequestBody Device device) throws DuplicateMemberException, URISyntaxException, NoSuchAlgorithmException, IOException, KeyManagementException, TimeoutException {
        deviceService.editDevice(device);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/deleteDevice/{idDevice}")
    public ResponseEntity deleteDevice(@PathVariable UUID idDevice) throws URISyntaxException, NoSuchAlgorithmException, IOException, KeyManagementException, TimeoutException {
        deviceService.deleteDevice(idDevice);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getAllDevices")
    public ResponseEntity<List<Device>> getAllDevices(){
        List<Device> devices = deviceService.findAllDevices();
        if(devices.isEmpty())
            throw new ResourceNotFoundException("No devices found!");
        return new ResponseEntity<>(devices, HttpStatus.OK);
    }
}
























