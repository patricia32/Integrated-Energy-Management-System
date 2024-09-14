package com.example.devices.controllers;

import com.example.devices.entities.Device;
import com.example.devices.services.DeviceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping(value = "/secure/device")
public class DeviceController {
    private final DeviceService deviceService;

    @Autowired
    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    public Device findDevice(UUID id){
        Optional<Device> device = deviceService.findDevice(id);
        return device.get();
    }

    @PostMapping("/addDevice")
    public ResponseEntity addDevice(@Valid @RequestBody Device device) {
        deviceService.createDevice(device);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/deleteDevice")
    public ResponseEntity deleteDevice(@Valid @RequestBody Device device) {
        deviceService.deleteDevice(device);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}