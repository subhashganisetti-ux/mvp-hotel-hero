-- Update all hotel prices to be between 1000 and 3500
UPDATE hotels 
SET price_per_night = 1000 + floor(random() * 2500)
WHERE price_per_night < 1000 OR price_per_night > 3500;