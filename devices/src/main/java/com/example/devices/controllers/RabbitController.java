package com.example.devices.controllers;


import com.example.devices.rabbitMQ.MessageSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RabbitController {
    private final MessageSender messageSender;

    @Autowired
    public RabbitController(MessageSender messageSender) {
        this.messageSender = messageSender;
    }

    @GetMapping("/send")
    public String send(@RequestParam String message){
        messageSender.sendMessage(message);
        return "Message sent to the queue: " + message;
    }
}
