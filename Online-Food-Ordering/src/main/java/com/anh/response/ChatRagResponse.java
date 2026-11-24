package com.anh.response;

import com.anh.model.Food;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRagResponse {
    private String reply;
    private Food dish;
    private String engineUsed;
}
