package com.example.devices.services;


import com.example.devices.dtos.MeasurementDTO;
import com.example.devices.dtos.SendMeasurementsDTO;
import com.example.devices.entities.Device;
import com.example.devices.entities.Measurement;
import com.example.devices.repositories.MeasurementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MeasurementService {
    private final MeasurementRepository measurementRepository;
    private final DeviceService deviceService;

    @Autowired
    public MeasurementService(MeasurementRepository measurementRepository, DeviceService deviceService){
        this.measurementRepository = measurementRepository;
        this.deviceService = deviceService;
    }

    public Measurement createMeasurement(MeasurementDTO measurementDTO){
        LocalDateTime localDateTime = measurementDTO.getTimestamp().toLocalDateTime();

        Measurement measurement = new Measurement();
        measurement.setDay(localDateTime.getDayOfMonth());
        measurement.setMonth(localDateTime.getMonthValue());
        measurement.setYear(localDateTime.getYear());
        measurement.setHour(measurementDTO.getTimestamp().getHours());
        measurement.setDeviceId(measurementDTO.getDeviceId());
        measurement.setValue(measurementDTO.getValue());

        Optional<Device> device = deviceService.findDevice(measurementDTO.getDeviceId());
        if (device.isPresent())
            deviceService.createDevice(device.get());
        return measurementRepository.save(measurement);
    }

    public List<SendMeasurementsDTO> getMeasurementsOfTheDay(UUID deviceId, int day, int month, int year){
        List<SendMeasurementsDTO> hourlyConsumptionList = measurementRepository.findAllByDeviceIdAndDayAndMonthAndYear(deviceId, day, month, year);

        List<SendMeasurementsDTO> orderedList = hourlyConsumptionList.stream()
                .sorted(Comparator.comparingInt(SendMeasurementsDTO::getHour))
                .collect(Collectors.toList());

        return orderedList;
    }

}
