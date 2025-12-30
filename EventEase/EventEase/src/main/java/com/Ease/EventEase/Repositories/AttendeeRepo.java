package com.Ease.EventEase.Repositories;

import com.Ease.EventEase.Models.Attendee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendeeRepo extends JpaRepository<Attendee,Integer> {

    Attendee findByEmail(String email);
}
