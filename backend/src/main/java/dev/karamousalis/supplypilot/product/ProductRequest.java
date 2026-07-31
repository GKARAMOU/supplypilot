package dev.karamousalis.supplypilot.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ProductRequest(
    @NotBlank String name,
    @NotBlank String sku,
    @NotBlank String category,
    @Min(0) int stock,
    @Min(1) int reorderLevel,
    @NotNull @DecimalMin("0.0") BigDecimal unitPrice,
    @NotBlank String supplier
) {}
