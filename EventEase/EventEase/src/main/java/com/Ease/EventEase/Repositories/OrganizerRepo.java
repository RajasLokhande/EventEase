package com.Ease.EventEase.Repositories;

import com.Ease.EventEase.Models.Organizer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizerRepo extends JpaRepository<Organizer,Integer> {
    Organizer findByEmail(String email);
}
