package com.example.devices.services;


import com.example.devices.entities.Device;
import com.example.devices.repositories.DeviceRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class DeviceService {
    private final DeviceRepository deviceRepository;

    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    public Optional<Device> findDevice(UUID id){
        return deviceRepository.findById(id);
    }

    public Device createDevice(Device device){
        return deviceRepository.save(device);
    }

    public void deleteDevice(Device device){
        deviceRepository.delete(deviceRepository.findById(device.getId()).get());
    }
}
