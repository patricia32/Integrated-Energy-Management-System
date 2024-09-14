package com.example.devices.rabbitMQ;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MessageReader {

    private final MessageHandlerDevice messageHandler;
    private final MessageHandlerMeasurement messageHandlerMeasurement;

    @Autowired
    public MessageReader(MessageHandlerDevice messageHandler, MessageHandlerMeasurement messageHandlerMeasurement) {
        this.messageHandler = messageHandler;
        this.messageHandlerMeasurement = messageHandlerMeasurement;
    }

    @RabbitListener(queues = "sensor")
    public void listen(String in) throws JsonProcessingException {
        messageHandlerMeasurement.messageHandlerMeasurement(in);
    }

    @RabbitListener(queues = "device_db_sender")
    public void listenDeviceDB(String in) throws JsonProcessingException {
        messageHandler.messageHandlerDevice(in);
    }
}
