package com.Ease.EventEase.Controller;

import com.Ease.EventEase.Models.Events;
import com.Ease.EventEase.Repositories.EventRepo;
import com.Ease.EventEase.Repositories.OrganizerRepo;
import jdk.jfr.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EventController {
    @Autowired
    EventRepo eventRepo;
    @PostMapping("/events")
    public String addEvents(@RequestBody Events obj){
         eventRepo.save(obj);
         return "Event created successfully";
    }

    @GetMapping("/events")
    public List<Events> showEvents(){
        return eventRepo.findAll();
    }

    @DeleteMapping("/events/{id}")
    public String delete(@PathVariable int id){
        Events event = eventRepo.findById(id).orElseThrow(()->new RuntimeException("Cannot delete"));
        eventRepo.delete(event);
        return "Deleted Successfully";
    }
}
