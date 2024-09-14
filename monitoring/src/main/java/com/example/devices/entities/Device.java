package com.example.devices.entities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Device {

    @Id
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "person_id", columnDefinition = "BINARY(16)")
    private UUID person_id;

    private int max_consumption;
    private int lastReadingHour = -1;
    private double totalConsumption = 0;
    private double partialConsumption = 0;
    private boolean warningSent = false;

    public Device(UUID id, UUID person_id, int max_consumption) {
        this.id = id;
        this.person_id = person_id;
        this.max_consumption = max_consumption;
    }
}
