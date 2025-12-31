package com.Ease.EventEase.Controller;

import com.Ease.EventEase.Models.Feedback;
import com.Ease.EventEase.Repositories.FeedbackRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class FeedbackController {
    @Autowired
    FeedbackRepo feedbackRepo;

    @PostMapping("/feedbacks")
    public String Feedback(@RequestBody Feedback obj){
        if(feedbackRepo.existsByAttendeeIdAndEventId(obj.getAttendeeId(), obj.getEventId())){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Email or Password");
        }
        feedbackRepo.save(obj);
        return "Feedback successfully given";
    }
}
