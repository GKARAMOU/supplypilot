package dev.karamousalis.supplypilot.product;

import java.math.BigDecimal;
import java.time.Instant;

public record ProductResponse(
    Long id,
    String name,
    String sku,
    String category,
    int stock,
    int reorderLevel,
    BigDecimal unitPrice,
    String supplier,
    String status,
    String updated,
    Instant updatedAt
) {
    static ProductResponse from(Product product) {
        String status = product.getStock() <= product.getReorderLevel() / 2
            ? "CRITICAL"
            : product.getStock() <= product.getReorderLevel() ? "LOW_STOCK" : "HEALTHY";
        return new ProductResponse(
            product.getId(),
            product.getName(),
            product.getSku(),
            product.getCategory(),
            product.getStock(),
            product.getReorderLevel(),
            product.getUnitPrice(),
            product.getSupplier(),
            status,
            "Recently",
            product.getUpdatedAt());
    }
}
