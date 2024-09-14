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
public class DeviceNewDTO {
    private String description;
    private String address;
    private int max_consumption;
    private UUID person;

}
