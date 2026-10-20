package com.anh.config;

import com.anh.dto.OrderNotificationDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OrderWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Map: restaurantId -> Set of active WebSocket sessions
    private final Map<Long, Set<WebSocketSession>> restaurantSessions = new ConcurrentHashMap<>();

    // Map: sessionId -> restaurantId for fast cleanup
    private final Map<String, Long> sessionRestaurantMap = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("[WebSocket] New client connected: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        try {
            JsonNode root = objectMapper.readTree(payload);
            String type = root.has("type") ? root.get("type").asText() : "";

            if ("SUBSCRIBE_RESTAURANT".equalsIgnoreCase(type) && root.has("restaurantId")) {
                Long restaurantId = root.get("restaurantId").asLong();
                restaurantSessions.computeIfAbsent(restaurantId, k -> ConcurrentHashMap.newKeySet()).add(session);
                sessionRestaurantMap.put(session.getId(), restaurantId);

                System.out.println("[WebSocket] Session " + session.getId() + " subscribed to Restaurant ID: " + restaurantId);

                // Send ACK back to frontend
                Map<String, Object> ack = Map.of(
                        "type", "SUBSCRIBE_ACK",
                        "restaurantId", restaurantId,
                        "status", "CONNECTED",
                        "message", "Kết nối nhận thông báo đơn hàng thời gian thực thành công!"
                );
                session.sendMessage(new TextMessage(objectMapper.writeValueAsString(ack)));
            } else if ("PING".equalsIgnoreCase(type)) {
                session.sendMessage(new TextMessage("{\"type\":\"PONG\"}"));
            }
        } catch (Exception e) {
            System.err.println("[WebSocket] Error handling message from " + session.getId() + ": " + e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String sessionId = session.getId();
        Long restaurantId = sessionRestaurantMap.remove(sessionId);
        if (restaurantId != null) {
            Set<WebSocketSession> sessions = restaurantSessions.get(restaurantId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    restaurantSessions.remove(restaurantId);
                }
            }
        }
        System.out.println("[WebSocket] Client disconnected: " + sessionId + " (Status: " + status + ")");
    }

    /**
     * Gửi thông báo đơn hàng mới tới tất cả các màn hình admin của nhà hàng tương ứng
     */
    public void broadcastToRestaurant(Long restaurantId, OrderNotificationDTO notification) {
        if (restaurantId == null || notification == null) return;

        Set<WebSocketSession> sessions = restaurantSessions.get(restaurantId);
        if (sessions == null || sessions.isEmpty()) {
            System.out.println("[WebSocket] No active admin sessions for restaurant ID: " + restaurantId + " (Order #" + notification.getOrderId() + ")");
            return;
        }

        try {
            String jsonPayload = objectMapper.writeValueAsString(notification);
            TextMessage textMessage = new TextMessage(jsonPayload);

            for (WebSocketSession s : sessions) {
                if (s.isOpen()) {
                    try {
                        s.sendMessage(textMessage);
                        System.out.println("[WebSocket] Sent order alert #" + notification.getOrderId() + " to session: " + s.getId());
                    } catch (IOException e) {
                        System.err.println("[WebSocket] Failed to send message to session " + s.getId() + ": " + e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("[WebSocket] Error serializing order notification: " + e.getMessage());
        }
    }
}
