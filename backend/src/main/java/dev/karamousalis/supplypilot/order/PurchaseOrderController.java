package dev.karamousalis.supplypilot.order;

import dev.karamousalis.supplypilot.shared.ResourceNotFoundException;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {
    private final PurchaseOrderRepository repository;

    public PurchaseOrderController(PurchaseOrderRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    List<PurchaseOrder> all() { return repository.findAll(); }

    @PostMapping
    PurchaseOrder create(@Valid @RequestBody PurchaseOrder order) {
        return repository.save(order);
    }

    @PatchMapping("/{id}/status")
    PurchaseOrder updateStatus(
        @PathVariable long id,
        @RequestParam PurchaseOrder.Status value
    ) {
        PurchaseOrder order = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Purchase order", id));
        order.setStatus(value);
        return repository.save(order);
    }
}
