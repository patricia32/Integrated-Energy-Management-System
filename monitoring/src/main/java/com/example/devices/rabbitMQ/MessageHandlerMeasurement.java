package com.example.devices.rabbitMQ;

import com.example.devices.constants.NotificationEndpoints;
import com.example.devices.controllers.DeviceController;
import com.example.devices.controllers.MeasurementController;
import com.example.devices.dtos.MeasurementDTO;
import com.example.devices.entities.Device;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Component
public class MessageHandlerMeasurement {
    private final DeviceController deviceController;
    private final MeasurementController measurementController;
    private final SimpMessagingTemplate template;

    @Autowired
    public MessageHandlerMeasurement(DeviceController deviceController, MeasurementController measurementController, SimpMessagingTemplate template) {
        this.deviceController = deviceController;
        this.measurementController = measurementController;
        this.template = template;
    }

    public void computeHourlyConsumption(Device device, int measurementHour, double measurementValue){
        if(device.getLastReadingHour() != measurementHour) {
            device.setLastReadingHour(measurementHour);
            device.setTotalConsumption(device.getTotalConsumption() + measurementValue);
            device.setPartialConsumption(measurementValue);
            deviceController.addDevice(device);

           if (device.getTotalConsumption() > device.getMax_consumption() && !device.isWarningSent()) {
               this.template.convertAndSend( NotificationEndpoints.UPPER_LIMIT_REACHED + String.valueOf(device.getPerson_id()), "You have reached the upper limit!");
               device.setWarningSent(true);
               deviceController.addDevice(device);
           }
       }
    }

    public void messageHandlerMeasurement(String message) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);

        String timestampString = jsonNode.get("timestamp").asText();
        UUID deviceId = UUID.fromString(jsonNode.get("device_id").asText());
        double measurementValue = jsonNode.get("measurement_value").asDouble();

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSSSS");
        Date parsedDate = null;
        try {
            parsedDate = dateFormat.parse(timestampString);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Timestamp timestamp = new Timestamp(parsedDate.getTime());

        MeasurementDTO measurementDTO = new MeasurementDTO(deviceId, measurementValue, timestamp);
        this.measurementController.addMeasurement(measurementDTO);

        Device device = deviceController.findDevice(measurementDTO.getDeviceId());
        if (device.getLastReadingHour() == -1){
            device.setLastReadingHour(timestamp.getHours());
            deviceController.addDevice(device);
        }

        computeHourlyConsumption(device, timestamp.getHours(), measurementValue);
    }
}
