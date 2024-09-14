package com.example.devices.services;


import com.example.devices.dtos.DeviceNewDTO;
import com.example.devices.entities.Device;
import com.example.devices.entities.Person;
import com.example.devices.repositories.DeviceRepository;
import com.example.devices.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeoutException;

@Service
public class DeviceService {
    private final PersonRepository personRepository;
    private final DeviceRepository deviceRepository;
    private final RabbitMQJsonSender rabbitMQJsonSender;

    @Autowired
    public DeviceService(PersonRepository personRepository, DeviceRepository deviceRepository, RabbitMQJsonSender rabbitMQJsonSender) {
        this.personRepository = personRepository;
        this.deviceRepository = deviceRepository;
        this.rabbitMQJsonSender = rabbitMQJsonSender;
    }

    public Device findDevice(UUID id){
        return deviceRepository.findById(id).get();
    }
    public List<Device> findAllDevices(){
        return deviceRepository.findAll();
    }

    public Device addDevice(DeviceNewDTO deviceNewDTO) throws URISyntaxException, NoSuchAlgorithmException, IOException, KeyManagementException, TimeoutException {
        Device device = new Device(deviceNewDTO.getDescription(), deviceNewDTO.getAddress(), deviceNewDTO.getMax_consumption(), null);
        if(deviceNewDTO.getPerson() != null){
            Person person = new Person(deviceNewDTO.getPerson());
            personRepository.save(person);
            device.setPerson(person);
        }

        deviceRepository.save(device);
        Device deviceNew = deviceRepository.findByAddressAndDescription(deviceNewDTO.getAddress(), deviceNewDTO.getDescription());
        if(deviceNew.getPerson() != null) rabbitMQJsonSender.sendDevice(deviceNew.getId(), deviceNew.getPerson().getId(), deviceNew.getMax_consumption(), "add");
        else                              rabbitMQJsonSender.sendDevice(deviceNew.getId(), null, deviceNew.getMax_consumption(), "add");
        return deviceNew;
    }
    public Device editDevice(Device device) throws URISyntaxException, NoSuchAlgorithmException, IOException, KeyManagementException, TimeoutException {
        Person person;
        if(device.getPerson() != null) {
            person = new Person(device.getPerson().getId());
            personRepository.save(person);
            device.setPerson(person);
        }
        deviceRepository.save(device);

        Device deviceDB = this.findDevice(device.getId());
        deviceDB.setPerson(device.getPerson());
        deviceDB.setDescription(device.getDescription());
        deviceDB.setAddress(device.getAddress());
        deviceDB.setMax_consumption(device.getMax_consumption());
        deviceRepository.save(deviceDB);

        Device deviceNew = deviceRepository.findByAddressAndDescription(device.getAddress(), device.getDescription());
        if(deviceNew.getPerson() != null) rabbitMQJsonSender.sendDevice(deviceNew.getId(), deviceNew.getPerson().getId(), deviceNew.getMax_consumption(), "edit");
        else                              rabbitMQJsonSender.sendDevice(deviceNew.getId(), null, deviceNew.getMax_consumption(), "edit");

        return deviceNew;
    }

    public void deleteDevice(UUID idDevice) throws URISyntaxException, NoSuchAlgorithmException, IOException, KeyManagementException, TimeoutException {
        Optional<Device> device = deviceRepository.findById(idDevice);

        if(device.get().getPerson() != null) rabbitMQJsonSender.sendDevice(device.get().getId(), device.get().getPerson().getId(), device.get().getMax_consumption(), "delete");
        else                                 rabbitMQJsonSender.sendDevice(device.get().getId(), null, device.get().getMax_consumption(), "delete");

        deviceRepository.delete(device.get());
    }

    public List<Device> getUserDevices(Person idClient){
       return deviceRepository.findAllByPerson(idClient);
    }
}
