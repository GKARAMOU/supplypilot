package dev.karamousalis.supplypilot.product;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.karamousalis.supplypilot.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ProductControllerIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired JwtService jwtService;

    @Test
    void createsAndListsAnInventoryProduct() throws Exception {
        String token = jwtService.issue("demo");
        mvc.perform(post("/api/products")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "name":"Moschofilero Mantinia",
                      "sku":"WIN-MOS-750",
                      "category":"White wine",
                      "stock":24,
                      "reorderLevel":12,
                      "unitPrice":14.50,
                      "supplier":"Arcadian Wines"
                    }
                    """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.sku").value("WIN-MOS-750"))
            .andExpect(jsonPath("$.status").value("HEALTHY"));

        mvc.perform(get("/api/products")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").value("Moschofilero Mantinia"));
    }
}
