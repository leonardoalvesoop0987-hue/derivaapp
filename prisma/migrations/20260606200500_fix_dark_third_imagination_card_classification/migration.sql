DO $$
DECLARE
  v_dark_deck_id TEXT;
  v_default_deck_id TEXT;
BEGIN
  -- 1. Obter o Deck Tons Mais Escuros
  SELECT id INTO v_dark_deck_id FROM decks WHERE system_key = 'deriva-dark-v1';
  
  -- Se o deck não existir, ignorar
  IF v_dark_deck_id IS NULL THEN
    RETURN;
  END IF;

  -- 2. Atualizar a carta explicitamente conhecida
  UPDATE cards
  SET 
    deck_id = v_dark_deck_id,
    requires_couple_unlock = true,
    unlock_group_key = 'DARK_THIRD_IMAGINATION',
    is_available_in_default = false,
    is_available_in_estreia = false,
    is_available_in_custom_selection = false
  WHERE system_key = 'deriva-v1-card-041';

  -- 3. Atualizar dinamicamente quaisquer outras cartas que fujam da regra de exclusividade do casal
  UPDATE cards
  SET 
    deck_id = v_dark_deck_id,
    requires_couple_unlock = true,
    unlock_group_key = 'DARK_THIRD_IMAGINATION',
    is_available_in_default = false,
    is_available_in_estreia = false,
    is_available_in_custom_selection = false
  WHERE 
    system_key != 'deriva-v1-card-041' 
    AND title NOT IN ('Personagens sorteados', 'Mistério permitido', 'Ordem sussurrada', 'Cena de hotel', 'Profissional com deslize', 'Proibição mental')
    AND (
      LOWER(title || ' ' || body) LIKE '%terceir%' OR
      LOWER(title || ' ' || body) LIKE '%presença%' OR
      LOWER(title || ' ' || body) LIKE '%imaginária%' OR
      LOWER(title || ' ' || body) LIKE '%imaginário%' OR
      LOWER(title || ' ' || body) LIKE '%ciúme%' OR
      LOWER(title || ' ' || body) LIKE '%confissão%' OR
      LOWER(title || ' ' || body) LIKE '%cuck%' OR
      LOWER(title || ' ' || body) LIKE '%outra pessoa%' OR
      LOWER(title || ' ' || body) LIKE '%outro homem%' OR
      LOWER(title || ' ' || body) LIKE '%outra mulher%' OR
      LOWER(title || ' ' || body) LIKE '%a três%'
    );

END $$;
