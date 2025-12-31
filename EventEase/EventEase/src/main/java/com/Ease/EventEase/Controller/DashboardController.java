package com.Ease.EventEase.Controller;

import com.Ease.EventEase.Models.Events;
import com.Ease.EventEase.Repositories.BookingRepo;
import com.Ease.EventEase.Repositories.EventRepo;
import com.Ease.EventEase.Repositories.FeedbackRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    EventRepo eventRepo;

    @Autowired
    BookingRepo bookingRepo;

    @Autowired
    FeedbackRepo feedbackRepo;

    @GetMapping("/organizers/{id}/stats")
    public Map<String, Long> getOrganizerStats(@PathVariable int id) {
        // 1. Get all events created by this organizer
        List<Events> myEvents = eventRepo.findByOrganizerId(id);

        long totalEvents = myEvents.size();
        long totalAttendees = 0;
        long totalFeedbacks = 0;

        // 2. Loop through each event and sum up bookings & feedback
        for (Events event : myEvents) {
            totalAttendees += bookingRepo.countByEventId(event.getId());
            totalFeedbacks += feedbackRepo.countByEventId(event.getId());
        }

        // 3. Prepare the response
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalEvents", totalEvents);
        stats.put("totalAttendees", totalAttendees);
        stats.put("totalFeedbacks", totalFeedbacks);

        return stats;
    }
}