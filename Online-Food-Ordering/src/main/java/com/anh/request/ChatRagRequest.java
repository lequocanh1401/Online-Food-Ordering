package com.anh.request;

import lombok.Data;
import java.util.List;

@Data
public class ChatRagRequest {
    private String message;
    private List<Long> dislikedFoodIds;
}
