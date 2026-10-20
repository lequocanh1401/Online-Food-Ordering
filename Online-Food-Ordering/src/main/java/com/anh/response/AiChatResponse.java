package com.anh.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
public class AiChatResponse {
    private String reply;
    private Instant timestamp;
    private Map<String, Object> metricsSummary;
    private List<String> suggestedPrompts;

    public AiChatResponse(String reply, Instant timestamp, Map<String, Object> metricsSummary, List<String> suggestedPrompts) {
        this.reply = reply;
        this.timestamp = timestamp;
        this.metricsSummary = metricsSummary;
        this.suggestedPrompts = suggestedPrompts;
    }
}
