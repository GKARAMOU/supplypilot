INSERT INTO products (name, sku, category, stock, reorder_level, unit_price, supplier, created_at, updated_at) VALUES
('Assyrtiko Santorini', 'WIN-ASS-750', 'White wine', 46, 20, 18.40, 'Aegean Cellars', NOW(), NOW()),
('Agiorgitiko Nemea', 'WIN-AGI-750', 'Red wine', 8, 18, 13.80, 'Nemea Estates', NOW(), NOW()),
('Xinomavro Reserve', 'WIN-XIN-750', 'Red wine', 4, 12, 21.50, 'Northern Vines', NOW(), NOW()),
('Rosé Provence', 'WIN-ROS-750', 'Rosé wine', 28, 15, 15.20, 'Maison Lumière', NOW(), NOW()),
('Prosecco DOC', 'SPK-PRO-750', 'Sparkling', 9, 14, 12.90, 'Veneto Trade', NOW(), NOW()),
('Small Batch Dry Gin', 'SPI-GIN-700', 'Spirits', 17, 10, 26.50, 'Craft Distillers', NOW(), NOW());

INSERT INTO suppliers (name, email, phone, lead_time) VALUES
('Aegean Cellars', 'orders@aegeancellars.example', '+30 210 555 0114', '3–4 days'),
('Nemea Estates', 'sales@nemeaestates.example', '+30 27460 55510', '2–3 days');

INSERT INTO expenses (category, description, amount, expense_date) VALUES
('Logistics', 'Supplier delivery', 186.40, CURRENT_DATE),
('Utilities', 'Warehouse electricity', 242.00, CURRENT_DATE - 4);

INSERT INTO purchase_orders (supplier, total_units, total_amount, status, created_at) VALUES
('Nemea Estates', 42, 684.00, 'IN_TRANSIT', NOW()),
('Veneto Trade', 30, 387.00, 'APPROVED', NOW());
