package com.anh.service;

import com.anh.request.AiChatRequest;
import com.anh.response.AiChatResponse;

public interface AiCopilotService {
    AiChatResponse chatWithCopilot(AiChatRequest request);
    AiChatResponse getQuickInsights(Long restaurantId);
}
