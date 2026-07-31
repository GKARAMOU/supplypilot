package dev.karamousalis.supplypilot.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    public static final String INVENTORY_EVENTS = "inventory.events";

    @Bean
    Queue inventoryEventsQueue() {
        return new Queue(INVENTORY_EVENTS, true);
    }
}
