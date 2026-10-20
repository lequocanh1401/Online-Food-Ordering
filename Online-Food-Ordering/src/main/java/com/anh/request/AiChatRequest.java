package com.anh.request;

import lombok.Data;
import java.util.List;

@Data
public class AiChatRequest {
    private Long restaurantId;
    private String message;
    private List<String> conversationHistory;
}
