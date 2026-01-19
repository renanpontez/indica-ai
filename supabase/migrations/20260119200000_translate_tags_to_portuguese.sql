-- Migration: Translate system tags to Portuguese (pt-BR)
-- Since the app's primary language is Portuguese-BR, update all system tag display_names

UPDATE tags SET display_name = CASE slug
  -- Places
  WHEN 'restaurant' THEN 'Restaurante'
  WHEN 'cafe' THEN 'Café'
  WHEN 'bar' THEN 'Bar'
  WHEN 'hotel' THEN 'Hotel'
  WHEN 'bakery' THEN 'Padaria'

  -- Meals
  WHEN 'breakfast' THEN 'Café da Manhã'
  WHEN 'brunch' THEN 'Brunch'
  WHEN 'lunch' THEN 'Almoço'
  WHEN 'dinner' THEN 'Jantar'
  WHEN 'coffee' THEN 'Café'
  WHEN 'dessert' THEN 'Sobremesa'

  -- Cuisines
  WHEN 'japanese' THEN 'Japonês'
  WHEN 'italian' THEN 'Italiano'
  WHEN 'brazilian' THEN 'Brasileiro'
  WHEN 'mexican' THEN 'Mexicano'
  WHEN 'french' THEN 'Francês'
  WHEN 'seafood' THEN 'Frutos do Mar'
  WHEN 'asian-fusion' THEN 'Asiático Fusion'
  WHEN 'american' THEN 'Americano'
  WHEN 'chinese' THEN 'Chinês'

  -- Dietary
  WHEN 'vegetarian' THEN 'Vegetariano'
  WHEN 'vegan' THEN 'Vegano'

  -- Other
  WHEN 'experience' THEN 'Experiência'
  WHEN 'nightlife' THEN 'Vida Noturna'
  WHEN 'fast-food' THEN 'Fast Food'

  -- Fallback: keep existing display_name
  ELSE display_name
END
WHERE is_system = true;
