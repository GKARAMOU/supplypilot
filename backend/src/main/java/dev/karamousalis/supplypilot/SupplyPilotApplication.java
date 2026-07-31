package dev.karamousalis.supplypilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class SupplyPilotApplication {
    public static void main(String[] args) {
        SpringApplication.run(SupplyPilotApplication.class, args);
    }
}
