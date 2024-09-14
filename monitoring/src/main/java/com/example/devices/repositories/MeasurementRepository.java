package com.example.devices.repositories;


import com.example.devices.dtos.SendMeasurementsDTO;
import com.example.devices.entities.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MeasurementRepository extends JpaRepository<Measurement, UUID> {
    List<SendMeasurementsDTO> findAllByDeviceIdAndDayAndMonthAndYear(UUID deviceId, int day, int month, int year);

}
