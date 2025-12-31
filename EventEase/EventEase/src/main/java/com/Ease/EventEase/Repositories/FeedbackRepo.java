package com.Ease.EventEase.Repositories;

import com.Ease.EventEase.Models.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepo extends JpaRepository<Feedback,Integer> {
    // CORRECT: 'existsBy' automatically checks true/false
    boolean existsByAttendeeIdAndEventId(int attendeeId, int eventId);

    long countByEventId(int id);
}
