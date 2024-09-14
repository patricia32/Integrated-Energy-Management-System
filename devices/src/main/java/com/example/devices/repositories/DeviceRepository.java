package com.example.devices.repositories;


import com.example.devices.entities.Device;
import com.example.devices.entities.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeviceRepository  extends JpaRepository<Device, UUID> {
    List<Device> findAll();
    Optional<Device> findById(UUID uuid);
    List<Device> findAllByPerson(Person person);
    Device findByAddressAndDescription(String address, String description);
}
