package com.Ease.EventEase.Repositories;

import com.Ease.EventEase.Models.Bookings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Bookings,Integer> {
    boolean existsByEventIdAndAttendeeId(int eventId, int attendeeId);

    List<Bookings> findByAttendeeId(int id);

    long countByEventId(int id);
}
