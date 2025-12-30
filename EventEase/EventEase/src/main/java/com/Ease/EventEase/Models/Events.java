package com.Ease.EventEase.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Events {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    @Column(nullable = false)
    String name;
    @Column(nullable = false)
    String date;
    @Column(nullable = false)
    String duration;
    @Column(nullable = false)
    int budget;
    @Column(nullable = false)
    String venueName;
    @Column(nullable = false)
    String venueAddress;
    @Column(nullable = false)
    int venueCapacity;
    @Column(nullable = false)
    int ticketPrice;
    @Column(nullable = false)
    int organizerId;
}
