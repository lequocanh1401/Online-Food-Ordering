package com.anh.service;

import com.anh.request.ChatRagRequest;
import com.anh.response.ChatRagResponse;

public interface CustomerChatService {
    ChatRagResponse chat(ChatRagRequest request);
}
