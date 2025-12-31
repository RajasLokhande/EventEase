package com.Ease.EventEase.Repositories;

import com.Ease.EventEase.Models.Events;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepo extends JpaRepository<Events,Integer> {
    List<Events> findByOrganizerId(int id);
}
