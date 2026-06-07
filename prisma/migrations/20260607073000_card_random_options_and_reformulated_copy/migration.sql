ALTER TABLE "cards" ADD COLUMN IF NOT EXISTS "random_options_enabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "cards" ADD COLUMN IF NOT EXISTS "persist_random_option" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS "card_random_options" (
  "id" TEXT NOT NULL,
  "card_id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "instruction_short" TEXT,
  "instruction_full" TEXT,
  "weight" INTEGER NOT NULL DEFAULT 1,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "min_intensity" "CardIntensity",
  "max_intensity" "CardIntensity",
  "requires_unlock" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "card_random_options_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "session_cards" ADD COLUMN IF NOT EXISTS "random_option_id" TEXT;

DO $$ BEGIN
  ALTER TABLE "card_random_options" ADD CONSTRAINT "card_random_options_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "session_cards" ADD CONSTRAINT "session_cards_random_option_id_fkey" FOREIGN KEY ("random_option_id") REFERENCES "card_random_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "card_random_options_card_id_is_active_idx" ON "card_random_options"("card_id", "is_active");
CREATE INDEX IF NOT EXISTS "session_cards_random_option_id_idx" ON "session_cards"("random_option_id");

DELETE FROM "card_random_options" WHERE "card_id" IN (SELECT "id" FROM "cards" WHERE "system_key" = 'deriva-v1-card-001');
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-001-option-01', "id", 'Massagem livre', 'Faz uma massagem gostosa no corpo inteiro. Ela relaxa e curte.', 'Faz uma massagem gostosa no corpo inteiro. Ela relaxa e guia o ritmo com pouco som e pouca palavra.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-001';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-001-option-02', "id", 'Profissional e cliente', 'Começa como profissional e cliente.', 'Entra na cena de profissional e cliente. Começa técnico, sério e atento, deixando o toque ficar íntimo aos poucos.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-001';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-001-option-03', "id", 'Deslize provocante', 'Deixa a massagem profissional escorregar pro íntimo.', 'Começa como massagem profissional e deixa pequenos deslizes provocantes aparecerem devagar, sempre percebendo a reação dela.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-001';
DELETE FROM "card_random_options" WHERE "card_id" IN (SELECT "id" FROM "cards" WHERE "system_key" = 'deriva-v1-card-012');
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-012-option-01', "id", 'Beijo demorado', 'Dá um beijo demorado e cheio de intenção.', 'Dá um beijo demorado, aproxima o corpo e deixa a provocação crescer sem pressa.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-012';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-012-option-02', "id", 'Toque por cima da roupa', 'Provoca por cima da roupa.', 'Toca por cima da roupa com calma, pressão e malícia, sem entregar tudo de uma vez.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-012';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-012-option-03', "id", 'Frase safada no ouvido', 'Sussurra uma frase safada no ouvido.', 'Chega no ouvido e solta uma frase safada, curta e direta, do jeito que deixa o clima mais perigoso.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-012';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-012-option-04', "id", 'Sem tocar', 'Fica sem tocar por um instante e só olha.', 'Fica sem tocar por um instante. Só olha, respira perto e deixa a vontade incomodar gostoso.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-012';
DELETE FROM "card_random_options" WHERE "card_id" IN (SELECT "id" FROM "cards" WHERE "system_key" = 'deriva-v1-card-036');
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-036-option-01', "id", 'Massagista e cliente', 'Entra na cena de massagista e cliente.', 'Entra na cena de massagista e cliente. Começa formal e deixa o desejo aparecer no toque.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-036';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-036-option-02', "id", 'Profissional de saúde e paciente adulto', 'Simula profissional de saúde e paciente adulto.', 'Simula profissional de saúde e paciente adulto, com cuidado, tensão e consentimento claro.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-036';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-036-option-03', "id", 'Dois desconhecidos em hotel', 'Vocês são dois desconhecidos adultos em um hotel.', 'Vocês são dois desconhecidos adultos em um hotel. A atração fica óbvia antes de alguém admitir.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-036';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-036-option-04', "id", 'Policial e suspeita adulta', 'Simula policial e suspeita adulta, sem medo real.', 'Simula policial e suspeita adulta, sem violência real. A tensão fica no olhar, na ordem e na aproximação.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-036';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-036-option-05', "id", 'Amantes escondidos', 'Vocês são amantes fictícios se encontrando escondido.', 'Vocês são amantes fictícios se encontrando escondido. A pressa e o segredo deixam tudo mais quente.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-036';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-036-option-06', "id", 'Professor e aluno adulto', 'Simula professor e aluno adulto.', 'Simula professor e aluno adulto. A cena fica adulta, consensual e provocante, sem exagero teatral.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-036';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-036-option-07', "id", 'Personal trainer e aluna adulta', 'Simula personal trainer e aluna adulta.', 'Simula personal trainer e aluna adulta. Usa comando, postura e proximidade pra aumentar a tensão.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-036';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-036-option-08', "id", 'Personagem livre', 'Escolhe um personagem adulto livre.', 'Escolhe um personagem adulto livre e entra na cena com naturalidade, mantendo o foco no desejo entre vocês.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-036';
DELETE FROM "card_random_options" WHERE "card_id" IN (SELECT "id" FROM "cards" WHERE "system_key" = 'deriva-v1-card-042');
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-042-option-01', "id", 'Sem pedir', 'Na próxima carta, não pode pedir.', 'Na próxima carta, não pode pedir. O desejo precisa aparecer no corpo, no olhar e na respiração.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-042';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-042-option-02', "id", 'Sem usar as mãos', 'Na próxima carta, não pode usar as mãos.', 'Na próxima carta, não pode usar as mãos. Usa boca, corpo, voz e presença pra provocar.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-042';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-042-option-03', "id", 'Sem beijo na boca', 'Na próxima carta, não pode beijar na boca.', 'Na próxima carta, não pode beijar na boca. Deixa a vontade crescer em volta do beijo proibido.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-042';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-042-option-04', "id", 'Sem mudar de posição', 'Na próxima carta, não pode mudar de posição.', 'Na próxima carta, não pode mudar de posição. Varia ritmo, pressão e intenção sem trocar a base.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-042';
INSERT INTO "card_random_options" ("id", "card_id", "label", "instruction_short", "instruction_full", "weight", "is_active", "requires_unlock")
SELECT 'deriva-v1-card-042-option-05', "id", 'Sem acelerar', 'Na próxima carta, não pode acelerar.', 'Na próxima carta, não pode acelerar. Sustenta o ritmo e deixa a tensão trabalhar por vocês.', 1, true, false FROM "cards" WHERE "system_key" = 'deriva-v1-card-042';
UPDATE "cards" SET "body" = 'Toca o corpo inteiro dela bem devagar, sem pressa e sem ir direto pras partes íntimas. Acorda cada pedacinho da pele antes de aumentar a intensidade.', "session_short_text" = 'Toca o corpo inteiro dela bem devagar, sem pressa nenhuma. Acorda a pele toda.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Mãos lentas';
UPDATE "cards" SET "body" = 'Ela escolhe três partes do corpo. Alterna entre mãos, boca e respiração quente, explorando sem pressa cada uma delas.', "session_short_text" = 'Ela escolhe três partes do corpo. Explora elas com mãos, boca e respiração.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Mapa de calor';
UPDATE "cards" SET "body" = 'Começa com uma massagem livre e gostosa no corpo inteiro. Ela só relaxa e guia o ritmo com pouca palavra ou gemido.', "session_short_text" = 'Faz uma massagem gostosa no corpo inteiro. Ela relaxa e curte.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Escolha do corpo';
UPDATE "cards" SET "body" = 'Beija, encosta e provoca bastante, mas não avança pro ato principal. Deixa o desejo crescer forte.', "session_short_text" = 'Beija, encosta e provoca bastante, mas não avança pro principal. Deixa a vontade subir.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Só pode provocar';
UPDATE "cards" SET "body" = 'Você é o profissional. Começa com uma massagem séria e técnica. Aos poucos deixa o toque ficar mais íntimo, quente e provocante.', "session_short_text" = 'Começa a massagem bem sério. Deixa o toque escorregar devagar pro íntimo.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Profissional e cliente';
UPDATE "cards" SET "body" = 'Fica em silêncio. Só toca, respira, beija e olha. Percebe o corpo dela com calma e atenção.', "session_short_text" = 'Silêncio total. Só toque, respiração, beijo e olhar profundo.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Sem pressa, sem fala';
UPDATE "cards" SET "body" = 'Começa beijando na boca e vai descendo bem devagar pelo pescoço, colo, barriga ou costas, sentindo cada reação.', "session_short_text" = 'Começa com beijo na boca e desce lentamente pelo corpo.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Beijo que desce';
UPDATE "cards" SET "body" = 'Fica bem coladinho, corpo com corpo, sem pressa pra avançar. Guia a mão dela pra onde quiser ser tocada.', "session_short_text" = 'Fica bem grudado, curtindo o corpo encostado sem pressa.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Pausa grudada';
UPDATE "cards" SET "body" = 'Fala baixinho no ouvido dela: “Agora eu quero...”. Seja direto e safado.', "session_short_text" = 'Fala bem baixinho no ouvido: “Agora eu quero...”.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Uma frase perigosa';
UPDATE "cards" SET "body" = 'Escolhe uma regra pra próxima carta e sussurra pra ela: sem mãos, sem beijo na boca, sem tirar a roupa que sobrou ou sem tocar nas partes íntimas ainda.', "session_short_text" = 'Escolhe uma regra provocante pra próxima carta.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Controle suspenso';
UPDATE "cards" SET "body" = 'Toma um gole, chega bem perto e fica olhando nos olhos por uns segundos. Depois fala o que está com mais vontade agora.', "session_short_text" = 'Toma um gole, olha bem no fundo dos olhos e fala o que quer fazer.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Bebida e olhar';
UPDATE "cards" SET "body" = 'Ela decide a ordem: começa pela boca, depois mãos, oral ou posição de controle. Ela manda quando quer avançar ou trocar.', "session_short_text" = 'Ela decide a sequência e dita o ritmo de tudo.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Ela escolhe a sequência';
UPDATE "cards" SET "body" = 'Dá pra ela o prazer com boca e mãos. Ela guia o ritmo, a pressão e a posição como quiser, sem explicar nada.', "session_short_text" = 'Dá prazer nela com boca e mãos. Ela guia tudo do jeito que gosta.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Ela guia';
UPDATE "cards" SET "body" = 'Ela escolhe a posição que quer receber prazer e marca o ritmo. Você só obedece e acompanha.', "session_short_text" = 'Ela escolhe a posição e controla o ritmo inteiro.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Controle dela';
UPDATE "cards" SET "body" = 'Alterna entre chupar bem gostoso e fazer pausas provocantes. Deixa ela louca de vontade entre uma e outra.', "session_short_text" = 'Alterna boca intensa com pausas bem safadas.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Boca e pausa';
UPDATE "cards" SET "body" = 'O foco é só o prazer dela. Dedica todo o tempo pra deixar ela cada vez mais excitada e entregue, sem cobrança de orgasmo.', "session_short_text" = 'Tudo pelo prazer dela. Entrega total.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Só o clímax importa';
UPDATE "cards" SET "body" = 'Ela guia você com comandos curtos: “mais devagar”, “continua”, “mais forte”, “aí”, “não muda”. Obedece na hora.', "session_short_text" = 'Ela comanda com frases curtas e você obedece imediatamente.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Guia sem vergonha';
UPDATE "cards" SET "body" = 'Ela completa: “Hoje eu quero que você...”. Realiza exatamente o que ela pedir.', "session_short_text" = 'Ela fala o que quer e você realiza.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Vontade confessada';
UPDATE "cards" SET "body" = 'Ela fica por cima e assume o controle total. Ritmo, profundidade, velocidade — tudo no tempo dela.', "session_short_text" = 'Ela fica por cima e domina o ritmo.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Ela por cima';
UPDATE "cards" SET "body" = 'Ela posiciona suas mãos exatamente onde quer e você só move quando ela mandar.', "session_short_text" = 'Ela coloca suas mãos onde deseja e você obedece.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Mãos obedientes';
UPDATE "cards" SET "body" = 'Ela escolhe: oral, mãos, vibrador ou combinação. Você executa exatamente como ela quer.', "session_short_text" = 'Ela escolhe a técnica e você obedece com vontade.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'O receptor manda';
UPDATE "cards" SET "body" = 'Sem vídeo. Relaxa e guia enquanto recebe boca e mãos alternando intensidade.', "session_short_text" = 'Sem tela. Só boca e mãos variando as sensações.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Sem tela, só boca';
UPDATE "cards" SET "body" = 'Chupa e estimula até ela quase gozar, então para de forma safada, beija, olha e provoca antes de voltar.', "session_short_text" = 'Leva ela quase no limite e interrompe de forma bem provocante.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Oral interrompido';
UPDATE "cards" SET "body" = 'Sorteia um vídeo curto. Não copia tudo, mas traz a mesma energia, ritmo e atitude da cena.', "session_short_text" = 'Sorteia um vídeo e copia a energia dele.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Copiar só a energia';
UPDATE "cards" SET "body" = 'Sorteia vídeos até encontrar um que agrade. Ela assiste relaxando enquanto você executa com mãos, boca ou vibrador.', "session_short_text" = 'Sorteia um vídeo e executa enquanto ela assiste.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Três vídeos, uma escolha';
UPDATE "cards" SET "body" = 'Sorteia um vídeo picante pra ela. Ela assiste enquanto recebe prazer do jeito que mais gosta.', "session_short_text" = 'Sorteia um vídeo focado nela enquanto você dá prazer.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Tela para ela';
UPDATE "cards" SET "body" = 'Sorteia um vídeo mais forte pro gosto dele. Ele assiste enquanto recebe atenção intensa.', "session_short_text" = 'Sorteia um vídeo forte enquanto você cuida dele.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Tela para ele';
UPDATE "cards" SET "body" = 'Escolhe uma posição e fica nela. Varia o ritmo, a profundidade, o beijo e a pressão sem trocar de posição.', "session_short_text" = 'Fica na mesma posição e varia intensidade e movimento.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Sem trocar por 3 minutos';
UPDATE "cards" SET "body" = 'Nada de penetração agora. Explora só com boca, mãos, corpo, beijo e esfregação pra deixar a vontade explodir.', "session_short_text" = 'Proibido penetrar. Vale tudo o resto pra provocar.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Proibido penetrar';
UPDATE "cards" SET "body" = 'Se ambos estiverem com muita vontade, sobe a intensidade pra algo mais forte e selvagem.', "session_short_text" = 'Se os dois quiserem, faz bem forte e selvagem.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Pico opcional';
UPDATE "cards" SET "body" = 'Ela escolhe a posição e o ritmo inicial. Você acompanha e só toma mais controle se ela permitir.', "session_short_text" = 'Ela define a posição e o ritmo.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Posição escolhida por ela';
UPDATE "cards" SET "body" = 'Começa bem lento e vai aumentando a intensidade aos poucos até ficar animal.', "session_short_text" = 'Começa devagar e vai acelerando até virar fogo.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Ritmo crescente';
UPDATE "cards" SET "body" = 'Pode ser forte e fundo, mas fica sempre atento à respiração e às reações dela.', "session_short_text" = 'Intensidade alta, mas sempre ligado nos sinais dela.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Forte, mas atento';
UPDATE "cards" SET "body" = 'Ela decide como termina esta carta: mais lenta, mais forte, com pausa provocante, trocando de posição ou encerrando suave.', "session_short_text" = 'Ela decide como termina a carta.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Ela no comando do fim';
UPDATE "cards" SET "body" = 'Escolhe uma regra e obedece na próxima carta: sem pedir, sem usar as mãos, sem beijo na boca, sem mudar de posição ou sem acelerar.', "session_short_text" = 'Obedece uma regra proibitiva na próxima carta.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Proibição mental';
UPDATE "cards" SET "body" = 'Imagina que tem mais alguém assistindo vocês com desejo. Sente o tesão de estar sendo observado.', "session_short_text" = 'Imagina que tem alguém olhando vocês com muita vontade.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Terceira presença imaginária';
UPDATE "cards" SET "body" = 'Entra no personagem sorteado e vive a cena com ela intensamente.', "session_short_text" = 'Entra no fetiche sorteado sem hesitar.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Personagens sorteados';
UPDATE "cards" SET "body" = 'Fecha os olhos e mergulha na sua fantasia mais safada. Ela acompanha a energia sem perguntar nada.', "session_short_text" = 'Mergulha na sua fantasia secreta enquanto ela acompanha.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Mistério permitido';
UPDATE "cards" SET "body" = 'Sussurra bem baixinho uma ordem safada no ouvido dela. Ela obedece.', "session_short_text" = 'Sussurra sua vontade bem safada e ela cumpre.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Ordem sussurrada';
UPDATE "cards" SET "body" = 'Vocês são dois estranhos dividindo o mesmo quarto de hotel. A tensão sexual está no ar. Deixa a vontade falar mais alto.', "session_short_text" = 'Vocês são dois estranhos num hotel que se desejam muito.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Cena de hotel';
UPDATE "cards" SET "body" = 'Você é o profissional. Começa formal e vai deixando o toque cada vez mais safado e fora dos limites.', "session_short_text" = 'Começa como profissional e vai deslizando pro proibido.', "updated_at" = CURRENT_TIMESTAMP WHERE "title" = 'Profissional com deslize';
UPDATE "cards" SET "title" = 'Provocação merecida', "body" = 'Quando alguém pula uma carta, entra uma provocação leve. Se ninguém pulou, a provocação vem só pelo prazer de brincar.', "session_short_text" = 'Uma provocação leve entra na cena.', "updated_at" = CURRENT_TIMESTAMP WHERE "system_key" = 'deriva-v1-card-012';
UPDATE "cards" SET "random_options_enabled" = true, "persist_random_option" = true, "updated_at" = CURRENT_TIMESTAMP WHERE "system_key" = 'deriva-v1-card-001';
UPDATE "cards" SET "random_options_enabled" = true, "persist_random_option" = true, "updated_at" = CURRENT_TIMESTAMP WHERE "system_key" = 'deriva-v1-card-012';
UPDATE "cards" SET "random_options_enabled" = true, "persist_random_option" = true, "updated_at" = CURRENT_TIMESTAMP WHERE "system_key" = 'deriva-v1-card-036';
UPDATE "cards" SET "random_options_enabled" = true, "persist_random_option" = true, "updated_at" = CURRENT_TIMESTAMP WHERE "system_key" = 'deriva-v1-card-042';
