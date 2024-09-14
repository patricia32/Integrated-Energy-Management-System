package com.example.devices.services;

import com.example.devices.controllers.RabbitController;
import com.example.devices.dtos.SendDeviceDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;
import java.util.concurrent.TimeoutException;

@Component
public class RabbitMQJsonSender {
    private final RabbitController rabbitController;

    @Autowired
    public RabbitMQJsonSender(RabbitController rabbitController) {
        this.rabbitController = rabbitController;
    }

    public  void sendDevice(UUID device_id, UUID person_id, int max_consumption, String operation) throws URISyntaxException, NoSuchAlgorithmException, KeyManagementException, IOException, TimeoutException {
        SendDeviceDTO deviceData = new SendDeviceDTO(device_id, person_id, max_consumption, operation);
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonData = objectMapper.writeValueAsString(deviceData);
        rabbitController.send(jsonData);
    }
}
