package com.Ease.EventEase.Controller;

import com.Ease.EventEase.Models.Bookings;
import com.Ease.EventEase.Repositories.BookingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // Import this
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api") // <--- ADD THIS (Crucial!)
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    BookingRepo bookingRepo;
    @PostMapping("/bookings")
    public ResponseEntity<String> book(@RequestBody Bookings book) {
        try {
            // 1. Efficiently check DB for duplicates using the new method
            boolean alreadyBooked = bookingRepo.existsByEventIdAndAttendeeId(
                    book.getEventId(),
                    book.getAttendeeId()
            );

            if (alreadyBooked) {
                // 2. Return an error if duplicate exists
                return ResponseEntity.badRequest().body("You have already booked this event!");
            }

            // 3. Save if new
            bookingRepo.save(book);
            return ResponseEntity.ok("Booked Successfully");

        } catch (Exception e) {
            e.printStackTrace(); // Good for debugging
            return ResponseEntity.status(500).body("Booking Failed");
        }
    }

    @GetMapping("/bookings/user/{id}")
    public List<Bookings> getUserBookings(@PathVariable int id) {
        return bookingRepo.findByAttendeeId(id);
    }
}