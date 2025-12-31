package com.Ease.EventEase.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Bookings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    @Column(nullable = false)
    int eventId;
    @Column(nullable = false)
    int attendeeId;
    @Column(nullable = false)
    String bookingDate;
}
