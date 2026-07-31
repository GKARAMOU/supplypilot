package dev.karamousalis.supplypilot.product;

import dev.karamousalis.supplypilot.shared.ConflictException;
import dev.karamousalis.supplypilot.shared.ResourceNotFoundException;
import java.util.List;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {
    private final ProductRepository repository;
    private final InventoryEventPublisher events;

    public ProductService(ProductRepository repository, InventoryEventPublisher events) {
        this.repository = repository;
        this.events = events;
    }

    @Transactional(readOnly = true)
    @Cacheable("products")
    public List<ProductResponse> findAll() {
        return repository.findAll().stream().map(ProductResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(long id) {
        return ProductResponse.from(repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", id)));
    }

    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse create(ProductRequest request) {
        if (repository.existsBySkuIgnoreCase(request.sku())) {
            throw new ConflictException("A product with this SKU already exists.");
        }
        Product product = map(new Product(), request);
        Product saved = repository.save(product);
        events.productCreated(saved);
        return ProductResponse.from(saved);
    }

    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse update(long id, ProductRequest request) {
        Product product = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        if (!product.getSku().equalsIgnoreCase(request.sku())
            && repository.existsBySkuIgnoreCase(request.sku())) {
            throw new ConflictException("A product with this SKU already exists.");
        }
        return ProductResponse.from(repository.save(map(product, request)));
    }

    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public void delete(long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Product", id);
        repository.deleteById(id);
    }

    private Product map(Product product, ProductRequest request) {
        product.setName(request.name().trim());
        product.setSku(request.sku().trim().toUpperCase());
        product.setCategory(request.category().trim());
        product.setStock(request.stock());
        product.setReorderLevel(request.reorderLevel());
        product.setUnitPrice(request.unitPrice());
        product.setSupplier(request.supplier().trim());
        return product;
    }
}
