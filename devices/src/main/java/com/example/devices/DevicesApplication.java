package com.example.devices;

import com.example.devices.entities.Device;
import com.example.devices.repositories.DeviceRepository;
import com.example.devices.repositories.PersonRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.UUID;

@SpringBootApplication
public class DevicesApplication {

    public static void main(String[] args) {
        SpringApplication.run(DevicesApplication.class, args);
    }

    @Bean
    CommandLineRunner init(PersonRepository personRepository, DeviceRepository deviceRepository) {
        return args -> {
            String uuidString = "506ea854-f1fa-4739-81d5-fc407908cc6b"; // Example UUID string
            UUID uuid = UUID.fromString(uuidString);
            Device device = new Device("Description", "Str. Crinilor nr. 43", 5000, null);
            Device device1 = new Device("Description 2 ", "Str. Salcam nr. 12", 500, null);
            Device device2 = new Device("Description 3 ", "Str. Mihai Eminescu nr. 23", 1200, null);
            Device device3 = new Device("Description 4 ", "Str. Mihai Viteazu nr. 24", 450, null);
            Device device4 = new Device("Description2 5 ", "Str. Avram Iancu nr. 257", 1000, null);
            deviceRepository.save(device);
            deviceRepository.save(device1);
            deviceRepository.save(device2);
            deviceRepository.save(device3);
            deviceRepository.save(device4);

        };
    }
}
