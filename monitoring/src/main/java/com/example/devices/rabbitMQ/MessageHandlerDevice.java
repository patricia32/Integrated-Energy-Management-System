package com.example.devices.rabbitMQ;

import com.example.devices.controllers.DeviceController;
import com.example.devices.entities.Device;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class MessageHandlerDevice {

    private final DeviceController deviceController;

    @Autowired
    public MessageHandlerDevice(DeviceController deviceController) {
        this.deviceController = deviceController;
    }

    public void messageHandlerDevice(String message) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);

        UUID deviceId = UUID.fromString(jsonNode.get("device_id").asText());
        int max_consumption = jsonNode.get("max_consumption").asInt();
        String operation = jsonNode.get("operation").asText();

        Device device = new Device(deviceId, null, max_consumption);
        if(!(jsonNode.get("person_id").asText()).equals("null"))
            device.setPerson_id(UUID.fromString(jsonNode.get("person_id").asText()));

        if(operation.equals("delete"))
            deviceController.deleteDevice(device);
        else
            deviceController.addDevice(device);
    }
}
