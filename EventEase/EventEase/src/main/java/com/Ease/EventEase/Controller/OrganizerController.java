package com.Ease.EventEase.Controller;

import com.Ease.EventEase.Models.Organizer;
import com.Ease.EventEase.Repositories.OrganizerRepo;
import com.Ease.EventEase.dto.OrganizerLoginDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class OrganizerController {
    @Autowired
    OrganizerRepo organizerRepo;
    @PostMapping("/organizer/register")
    public String register(@RequestBody Organizer obj){
        organizerRepo.save(obj);
        return "Organizer Registered Successfully";
    }

    @PostMapping("/organizer/login")
    public Organizer login(@RequestBody OrganizerLoginDto dto){
        Organizer organizer = organizerRepo.findByEmail(dto.getEmail());
        if(organizer != null && organizer.getPassword().equals(dto.getPassword())){
            return organizer;
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Email or Password");
    }
}
