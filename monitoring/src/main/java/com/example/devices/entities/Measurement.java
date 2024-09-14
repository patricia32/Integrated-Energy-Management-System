package com.example.devices.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.io.Serializable;
import java.util.UUID;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Measurement implements Serializable {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "deviceId", nullable = false, columnDefinition = "BINARY(16)")
    private UUID deviceId;

    @Column(name = "value", nullable = false)
    private double value;

    private int day;
    private int month;
    private int year;
    private int hour;

    public Measurement(UUID deviceId, double value, int day, int month, int year) {
        this.deviceId = deviceId;
        this.value = value;
        this.day = day;
        this.month = month;
        this.year = year;
    }
}
