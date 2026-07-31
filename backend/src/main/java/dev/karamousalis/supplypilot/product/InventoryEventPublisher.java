package dev.karamousalis.supplypilot.product;

import dev.karamousalis.supplypilot.config.RabbitConfig;
import java.time.Instant;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class InventoryEventPublisher {
    private static final Logger log = LoggerFactory.getLogger(InventoryEventPublisher.class);
    private final RabbitTemplate rabbitTemplate;

    public InventoryEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    void productCreated(Product product) {
        try {
            rabbitTemplate.convertAndSend(RabbitConfig.INVENTORY_EVENTS, Map.of(
                "type", "PRODUCT_CREATED",
                "productId", product.getId(),
                "sku", product.getSku(),
                "occurredAt", Instant.now().toString()));
        } catch (AmqpException exception) {
            log.warn("Inventory event delivery deferred: {}", exception.getMessage());
        }
    }
}
