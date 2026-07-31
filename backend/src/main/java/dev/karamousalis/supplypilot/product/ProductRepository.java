package dev.karamousalis.supplypilot.product;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsBySkuIgnoreCase(String sku);
    List<Product> findByStockLessThanEqualOrderByStockAsc(int stock);
}
