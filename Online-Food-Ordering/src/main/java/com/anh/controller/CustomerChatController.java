package com.anh.controller;

import com.anh.request.ChatRagRequest;
import com.anh.response.ChatRagResponse;
import com.anh.service.CustomerChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class CustomerChatController {

    @Autowired
    private CustomerChatService customerChatService;

    @PostMapping("/concierge")
    public ResponseEntity<ChatRagResponse> chatConcierge(@RequestBody ChatRagRequest request) {
        ChatRagResponse response = customerChatService.chat(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
