package com.Ease.EventEase.Controller;

import com.Ease.EventEase.Models.Attendee;
import com.Ease.EventEase.Repositories.AttendeeRepo;
import com.Ease.EventEase.dto.Logindto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AttendeeController {
    @Autowired
    AttendeeRepo attendeeRepo;

    @PostMapping("/attendee/register")
    public String register(@RequestBody Attendee attendee){
       attendeeRepo.save(attendee);
       return "registered Successfully";
    }

    @PostMapping("/attendee/login")
    public Attendee login(@RequestBody Logindto dto) {
        Attendee attendee = attendeeRepo.findByEmail(dto.getEmail());
        if (attendee != null&&(attendee.getPassword().equalsIgnoreCase(dto.getPassword()))) {
            return attendee;
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Email or Password");
    }
}
