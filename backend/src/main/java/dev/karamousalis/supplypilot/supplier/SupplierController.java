package dev.karamousalis.supplypilot.supplier;

import dev.karamousalis.supplypilot.shared.ResourceNotFoundException;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {
    private final SupplierRepository repository;

    public SupplierController(SupplierRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    List<Supplier> all() { return repository.findAll(); }

    @PostMapping
    Supplier create(@Valid @RequestBody Supplier supplier) {
        return repository.save(supplier);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Supplier", id);
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
