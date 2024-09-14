package com.example.devices.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SendDeviceDTO {
    UUID device_id;
    UUID person_id;
    int max_consumption;
    String operation;
}
