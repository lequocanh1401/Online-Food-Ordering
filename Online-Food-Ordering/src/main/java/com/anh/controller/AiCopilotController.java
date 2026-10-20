package com.anh.controller;

import com.anh.request.AiChatRequest;
import com.anh.response.AiChatResponse;
import com.anh.service.AiCopilotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/ai/copilot")
public class AiCopilotController {

    @Autowired
    private AiCopilotService aiCopilotService;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chatWithCopilot(
            @RequestBody AiChatRequest request,
            @RequestHeader(value = "Authorization", required = false) String jwt) {
        AiChatResponse response = aiCopilotService.chatWithCopilot(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/quick-insights/{restaurantId}")
    public ResponseEntity<AiChatResponse> getQuickInsights(
            @PathVariable Long restaurantId,
            @RequestHeader(value = "Authorization", required = false) String jwt) {
        AiChatResponse response = aiCopilotService.getQuickInsights(restaurantId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
