package com.example.devices.controllers;

import com.example.devices.dtos.MeasurementDTO;
import com.example.devices.dtos.SendMeasurementsDTO;
import com.example.devices.services.MeasurementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping(value = "/secure/measurement")
public class MeasurementController {
    private final MeasurementService measurementService;

    public MeasurementController(MeasurementService measurementService) {
        this.measurementService = measurementService;
    }

    @PostMapping("/addMeasurement")
    public ResponseEntity addMeasurement(@Valid @RequestBody MeasurementDTO measurementDTO) {
        measurementService.createMeasurement(measurementDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getMeasurementsOfTheDay/{deviceId}/{day}/{month}/{year}")
    public ResponseEntity<List<SendMeasurementsDTO>> getMeasurementsOfTheDay(@PathVariable UUID deviceId, @PathVariable int day, @PathVariable int month, @PathVariable int year){
        List<SendMeasurementsDTO> measurementValues = measurementService.getMeasurementsOfTheDay(deviceId, day, month, year);
        return new ResponseEntity<>(measurementValues, HttpStatus.OK);
    }
}
