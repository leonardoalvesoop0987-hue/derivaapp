import { PrismaClient, CardCategory, CardIntensity, ReceiverRule } from '@prisma/client';

const prisma = new PrismaClient();

const cards = [
  {
    "position": 1,
    "system_key": "deriva-v1-card-001",
    "title": "Escolha do corpo",
    "category": "AZUL",
    "intensity": "LEVE",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "A sessão começa com uma escolha sorteada:\n\n1. massagem livre no corpo inteiro;\n2. massagem como profissional e cliente;\n3. massagem profissional com pequenos deslizes provocantes.\n\nQuem recebe apenas relaxa e guia o ritmo com poucas palavras."
  },
  {
    "position": 2,
    "system_key": "deriva-v1-card-002",
    "title": "Mãos lentas",
    "category": "AZUL",
    "intensity": "LEVE",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Quem conduz deve tocar o corpo inteiro da outra pessoa lentamente, sem ir direto às partes íntimas.\n\nA intenção é acordar o corpo antes de aumentar a intensidade.\n\nTempo sugerido: até 5 minutos."
  },
  {
    "position": 3,
    "system_key": "deriva-v1-card-003",
    "title": "Mapa de calor",
    "category": "AZUL",
    "intensity": "QUENTE",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Quem recebe escolhe três partes do corpo para receber atenção.\n\nQuem conduz deve alternar mãos, boca e respiração, sem pressa."
  },
  {
    "position": 4,
    "system_key": "deriva-v1-card-004",
    "title": "Só pode provocar",
    "category": "AZUL",
    "intensity": "QUENTE",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Durante esta carta, quem conduz pode beijar, encostar e provocar, mas não pode ir direto para o ato principal.\n\nQuem recebe pode pedir mais intensidade, mas o limite da carta é manter o desejo crescendo.\n\nTempo máximo: 4 minutos."
  },
  {
    "position": 5,
    "system_key": "deriva-v1-card-005",
    "title": "Profissional e cliente",
    "category": "AZUL",
    "intensity": "QUENTE",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Sorteiem quem será profissional e quem será cliente.\n\nA cena deve começar como uma massagem séria, mas aos poucos o toque passa a ficar mais íntimo e ambíguo.\n\nNada precisa ser exagerado. O clima está no deslize."
  },
  {
    "position": 6,
    "system_key": "deriva-v1-card-006",
    "title": "Sem pressa, sem fala",
    "category": "AZUL",
    "intensity": "LEVE",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Por alguns minutos, ninguém explica nada.\n\nSó toque, respiração, beijo e olhar.\n\nQuem conduz deve perceber o corpo da outra pessoa sem perguntar demais."
  },
  {
    "position": 7,
    "system_key": "deriva-v1-card-007",
    "title": "Bebida e olhar",
    "category": "DERIVA",
    "intensity": "LEVE",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Pausa breve.\n\nTomem um gole, se aproximem e fiquem alguns segundos apenas se olhando.\n\nDepois, quem quiser pode dizer uma frase curta sobre o que está com vontade de fazer."
  },
  {
    "position": 8,
    "system_key": "deriva-v1-card-008",
    "title": "Beijo que desce",
    "category": "DERIVA",
    "intensity": "QUENTE",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Comecem com beijo na boca.\n\nDepois, o beijo deve descer lentamente pelo pescoço, colo, barriga ou costas, sem pressa.\n\nTempo sugerido: até 3 minutos."
  },
  {
    "position": 9,
    "system_key": "deriva-v1-card-009",
    "title": "Uma frase perigosa",
    "category": "DERIVA",
    "intensity": "QUENTE",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Cada um deve dizer uma frase curta começando com:\n\n“Agora eu queria…”\n\nNão precisa explicar demais.\n\nA frase deve provocar, não virar conversa longa."
  },
  {
    "position": 10,
    "system_key": "deriva-v1-card-010",
    "title": "Controle suspenso",
    "category": "DERIVA",
    "intensity": "QUENTE",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Quem recebeu a carta escolhe uma regra temporária para a próxima carta:\n\n- sem usar as mãos;\n- sem beijo na boca;\n- sem tirar a roupa que ainda resta;\n- sem tocar nas partes íntimas até o final da próxima carta.\n\nA regra deve provocar, não travar o jogo."
  },
  {
    "position": 11,
    "system_key": "deriva-v1-card-011",
    "title": "Pausa grudada",
    "category": "DERIVA",
    "intensity": "LEVE",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Fiquem bem próximos, com o corpo encostado, sem pressa para avançar.\n\nQuem quiser pode guiar a mão da outra pessoa para onde deseja receber carinho."
  },
  {
    "position": 12,
    "system_key": "deriva-v1-card-012",
    "title": "O app provocou",
    "category": "DERIVA",
    "intensity": "QUENTE",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Quem pulou alguma carta nesta sessão deve receber uma provocação leve agora.\n\nA outra pessoa escolhe entre:\n\n1. beijo demorado;\n2. toque por cima da roupa;\n3. frase safada no ouvido;\n4. ficar sem tocar por 1 minuto enquanto apenas olha.\n\nSe ninguém pulou carta, sorteiem uma das quatro opções mesmo assim."
  },
  {
    "position": 13,
    "system_key": "deriva-v1-card-013",
    "title": "Ela guia",
    "category": "ROSA",
    "intensity": "INTENSO",
    "is_invertible": true,
    "requires_video": false,
    "receiver_rule": "WOMAN",
    "body": "A mulher recebe atenção íntima com boca, mãos ou ambos.\n\nEla pode guiar ritmo, pressão e posição, sem precisar justificar.\n\nTempo máximo: 6 minutos."
  },
  {
    "position": 14,
    "system_key": "deriva-v1-card-014",
    "title": "Controle dela",
    "category": "ROSA",
    "intensity": "INTENSO",
    "is_invertible": true,
    "requires_video": false,
    "receiver_rule": "WOMAN",
    "body": "A mulher escolhe a posição em que quer receber prazer.\n\nQuem conduz deve obedecer ao ritmo dela e só mudar se ela permitir."
  },
  {
    "position": 15,
    "system_key": "deriva-v1-card-015",
    "title": "Boca e pausa",
    "category": "ROSA",
    "intensity": "INTENSO",
    "is_invertible": true,
    "requires_video": false,
    "receiver_rule": "WOMAN",
    "body": "Quem conduz deve alternar prazer oral e pausas curtas de provocação.\n\nA pausa serve para aumentar a vontade, não para quebrar o clima.\n\nTempo máximo: 5 minutos."
  },
  {
    "position": 16,
    "system_key": "deriva-v1-card-016",
    "title": "Ela por cima",
    "category": "ROSA",
    "intensity": "INTENSO",
    "is_invertible": true,
    "requires_video": false,
    "receiver_rule": "WOMAN",
    "body": "A mulher fica no controle do ritmo.\n\nPode usar beijo, mãos, quadril, voz ou silêncio.\n\nA outra pessoa deve acompanhar sem tentar dominar a cena."
  },
  {
    "position": 17,
    "system_key": "deriva-v1-card-017",
    "title": "Só o clímax importa",
    "category": "ROSA",
    "intensity": "INTENSO",
    "is_invertible": true,
    "requires_video": false,
    "receiver_rule": "WOMAN",
    "body": "Durante esta carta, o foco é exclusivamente o prazer dela.\n\nSem cobrança de chegar ao orgasmo.\n\nA meta é aumentar excitação, resposta do corpo e entrega.\n\nTempo máximo: 7 minutos."
  },
  {
    "position": 18,
    "system_key": "deriva-v1-card-018",
    "title": "Guia sem vergonha",
    "category": "ROSA",
    "intensity": "INTENSO",
    "is_invertible": true,
    "requires_video": false,
    "receiver_rule": "WOMAN",
    "body": "A mulher deve guiar com frases simples:\n\n- “mais devagar”;\n- “continua”;\n- “mais forte”;\n- “aí”;\n- “não muda”.\n\nQuem conduz deve seguir sem discutir."
  },
  {
    "position": 19,
    "system_key": "deriva-v1-card-019",
    "title": "Mãos obedientes",
    "category": "ROSA",
    "intensity": "QUENTE",
    "is_invertible": true,
    "requires_video": false,
    "receiver_rule": "WOMAN",
    "body": "A mulher posiciona as mãos da outra pessoa onde quiser.\n\nA outra pessoa só pode mudar o toque se ela permitir.\n\nTempo sugerido: até 4 minutos."
  },
  {
    "position": 20,
    "system_key": "deriva-v1-card-020",
    "title": "Ela escolhe a sequência",
    "category": "ROSA",
    "intensity": "INTENSO",
    "is_invertible": true,
    "requires_video": false,
    "receiver_rule": "WOMAN",
    "body": "A mulher escolhe a ordem:\n\n1. beijo;\n2. mãos;\n3. oral;\n4. posição de controle.\n\nA carta termina quando ela decidir avançar ou trocar de categoria."
  },
  {
    "position": 21,
    "system_key": "deriva-v1-card-021",
    "title": "Vontade confessada",
    "category": "ROSA",
    "intensity": "QUENTE",
    "is_invertible": true,
    "requires_video": false,
    "receiver_rule": "WOMAN",
    "body": "A mulher completa a frase:\n\n“Hoje eu quero que você…”\n\nEla pode ser direta, vaga ou apenas apontar com o corpo.\n\nQuem ouve deve executar dentro do limite combinado."
  },
  {
    "position": 22,
    "system_key": "deriva-v1-card-022",
    "title": "Tela para ela",
    "category": "ROXO",
    "intensity": "INTENSO",
    "is_invertible": true,
    "requires_video": true,
    "receiver_rule": "WOMAN",
    "body": "Sorteie um vídeo conforme a regra do deck.\n\nA mulher assiste enquanto recebe oral, mãos, vibrador ou masturbação.\n\nDistribuição recomendada do vídeo:\n\n- 70% lésbico;\n- 20% FFM;\n- 10% MMF.\n\nEla pode pedir para trocar até o limite de pulos de vídeo."
  },
  {
    "position": 23,
    "system_key": "deriva-v1-card-023",
    "title": "Tela para ele",
    "category": "ROXO",
    "intensity": "INTENSO",
    "is_invertible": true,
    "requires_video": true,
    "receiver_rule": "MAN",
    "body": "Sorteie um vídeo conforme a regra do deck.\n\nO homem assiste enquanto recebe oral, mãos ou masturbação.\n\nDistribuição recomendada do vídeo:\n\n- 70% FFM;\n- 10% face FM;\n- 20% lésbico."
  },
  {
    "position": 24,
    "system_key": "deriva-v1-card-024",
    "title": "Sem tela, só boca",
    "category": "ROXO",
    "intensity": "INTENSO",
    "is_invertible": true,
    "requires_video": false,
    "receiver_rule": "ANY",
    "body": "Sem vídeo nesta carta.\n\nQuem receber deve apenas relaxar e guiar o ritmo.\n\nQuem conduz deve usar boca e mãos, alternando intensidade.\n\nO receptor pode inverter o destino da carta."
  },
  {
    "position": 25,
    "system_key": "deriva-v1-card-025",
    "title": "Três vídeos, uma escolha",
    "category": "ROXO",
    "intensity": "INTENSO",
    "is_invertible": true,
    "requires_video": true,
    "receiver_rule": "ANY",
    "body": "O sistema sorteia até 3 vídeos.\n\nO casal pode pular os dois primeiros e, no terceiro, escolher entre os sorteados.\n\nQuem recebe assiste.\n\nQuem conduz executa com mãos, boca ou vibrador."
  },
  {
    "position": 26,
    "system_key": "deriva-v1-card-026",
    "title": "Copiar só a energia",
    "category": "ROXO",
    "intensity": "INTENSO",
    "is_invertible": true,
    "requires_video": true,
    "receiver_rule": "ANY",
    "body": "Sorteiem um vídeo curto.\n\nA regra não é copiar a cena inteira, mas copiar a energia: ritmo, provocação, posição do corpo ou atitude.\n\nNão usar esta carta durante penetração."
  },
  {
    "position": 27,
    "system_key": "deriva-v1-card-027",
    "title": "Oral interrompido",
    "category": "ROXO",
    "intensity": "INTENSO",
    "is_invertible": true,
    "requires_video": false,
    "receiver_rule": "ANY",
    "body": "Quem conduz começa oral ou masturbação, mas deve interromper brevemente sempre que quem recebe parecer perto demais do pico.\n\nA pausa deve ser provocante, com beijo, olhar ou frase curta.\n\nTempo máximo: 6 minutos."
  },
  {
    "position": 28,
    "system_key": "deriva-v1-card-028",
    "title": "O receptor manda",
    "category": "ROXO",
    "intensity": "INTENSO",
    "is_invertible": true,
    "requires_video": false,
    "receiver_rule": "ANY",
    "body": "Quem recebe escolhe:\n\n1. oral;\n2. mãos;\n3. vibrador;\n4. combinação livre.\n\nQuem conduz não escolhe a técnica, apenas executa e ajusta."
  },
  {
    "position": 29,
    "system_key": "deriva-v1-card-029",
    "title": "Ritmo crescente",
    "category": "VERMELHO",
    "intensity": "INTENSO",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Comecem em ritmo lento.\n\nA cada minuto, aumentem um pouco a intensidade.\n\nQuem recebe pode dizer “fica” para manter o ritmo atual."
  },
  {
    "position": 30,
    "system_key": "deriva-v1-card-030",
    "title": "Posição escolhida por ela",
    "category": "VERMELHO",
    "intensity": "INTENSO",
    "is_invertible": true,
    "requires_video": false,
    "receiver_rule": "WOMAN",
    "body": "A mulher escolhe a posição e o ritmo inicial.\n\nA outra pessoa só pode assumir mais controle se ela permitir."
  },
  {
    "position": 31,
    "system_key": "deriva-v1-card-031",
    "title": "Forte, mas atento",
    "category": "VERMELHO",
    "intensity": "PICO",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "A intensidade pode subir, mas deve continuar responsiva.\n\nQuem conduz precisa observar respiração, corpo e reação.\n\nNada de ignorar sinais."
  },
  {
    "position": 32,
    "system_key": "deriva-v1-card-032",
    "title": "Sem trocar por 3 minutos",
    "category": "VERMELHO",
    "intensity": "INTENSO",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Escolham uma posição.\n\nDurante até 3 minutos, não podem trocar.\n\nO desafio é variar ritmo, beijo, mãos e pressão sem mudar a base."
  },
  {
    "position": 33,
    "system_key": "deriva-v1-card-033",
    "title": "Ela no comando do fim",
    "category": "VERMELHO",
    "intensity": "PICO",
    "is_invertible": true,
    "requires_video": false,
    "receiver_rule": "WOMAN",
    "body": "A mulher decide se esta carta será:\n\n1. mais lenta;\n2. mais forte;\n3. com pausa provocante;\n4. com troca de posição;\n5. com encerramento suave.\n\nA decisão dela guia o restante da carta."
  },
  {
    "position": 34,
    "system_key": "deriva-v1-card-034",
    "title": "Proibido penetrar",
    "category": "VERMELHO",
    "intensity": "INTENSO",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Durante esta carta, não pode haver penetração.\n\nSó boca, mãos, corpo, beijo, atrito e provocação.\n\nA graça é aumentar a vontade sem entregar tudo imediatamente.\n\nTempo máximo: 5 minutos."
  },
  {
    "position": 35,
    "system_key": "deriva-v1-card-035",
    "title": "Pico opcional",
    "category": "VERMELHO",
    "intensity": "PICO",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Esta carta só vale se ambos quiserem subir a intensidade.\n\nPode envolver posição mais forte, fantasia corporal ou prática previamente aceita pelo casal.\n\nSe qualquer um hesitar, transforme esta carta em Deriva."
  },
  {
    "position": 36,
    "system_key": "deriva-v1-card-036",
    "title": "Personagens sorteados",
    "category": "PRETO",
    "intensity": "INTENSO",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Sorteiem personagem e situação.\n\nAmbos devem entrar na cena sem exagerar.\n\nSugestões possíveis:\n\n- massagista e cliente;\n- enfermeira e paciente adulto;\n- dois estranhos em hotel;\n- policial e suspeita adulta;\n- amantes se encontrando escondido;\n- professora/professor e aluno adulto;\n- personagem livre escolhido pelo sistema."
  },
  {
    "position": 37,
    "system_key": "deriva-v1-card-037",
    "title": "Mistério permitido",
    "category": "PRETO",
    "intensity": "PICO",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Uma pessoa pode imaginar outra pessoa ou não imaginar ninguém.\n\nNão precisa revelar nada.\n\nA outra pessoa deve apenas seguir a cena como se existisse um segredo no ar.\n\nRegra: ninguém pergunta quem foi, nem depois."
  },
  {
    "position": 38,
    "system_key": "deriva-v1-card-038",
    "title": "Ordem sussurrada",
    "category": "PRETO",
    "intensity": "INTENSO",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Quem recebeu a carta deve sussurrar uma ordem curta.\n\nQuem ouve deve cumprir dentro dos limites combinados.\n\nA ordem deve ser direta, mas não precisa ser extrema."
  },
  {
    "position": 39,
    "system_key": "deriva-v1-card-039",
    "title": "Cena de hotel",
    "category": "PRETO",
    "intensity": "INTENSO",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Vocês são dois adultos que acabaram dividindo o mesmo quarto por acaso.\n\nA atração já está óbvia, mas ninguém quer admitir primeiro.\n\nA cena começa com provocação verbal e aproximação lenta."
  },
  {
    "position": 40,
    "system_key": "deriva-v1-card-040",
    "title": "Profissional com deslize",
    "category": "PRETO",
    "intensity": "INTENSO",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Sorteiem quem será o profissional e quem será o cliente.\n\nA cena começa formal, mas o toque passa do limite de propósito.\n\nQuem recebe decide até onde o deslize continua."
  },
  {
    "position": 41,
    "system_key": "deriva-v1-card-041",
    "title": "Terceira presença imaginária",
    "category": "PRETO",
    "intensity": "PICO",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Imaginem uma terceira pessoa adulta apenas como presença na fantasia.\n\nNinguém precisa dizer rosto, nome ou identidade.\n\nA cena deve focar no casal e na sensação de estar sendo observado ou desejado.\n\nNão vale citar ex."
  },
  {
    "position": 42,
    "system_key": "deriva-v1-card-042",
    "title": "Proibição mental",
    "category": "PRETO",
    "intensity": "INTENSO",
    "is_invertible": false,
    "requires_video": false,
    "receiver_rule": "NONE",
    "body": "Durante a próxima carta, uma regra deve ser obedecida:\n\n1. não pode pedir;\n2. não pode tocar com as mãos;\n3. não pode beijar a boca;\n4. não pode mudar de posição;\n5. não pode acelerar.\n\nSorteiem uma opção.\n\nA regra dura apenas uma carta."
  }
];

async function main() {
  const defaultDeckKey = 'deriva-default-v1';
  
  let deck = await prisma.deck.findUnique({
    where: { system_key: defaultDeckKey }
  });

  if (!deck) {
    deck = await prisma.deck.create({
      data: {
        system_key: defaultDeckKey,
        name: 'Deck Padrão',
        type: 'SYSTEM',
        is_default: true,
      }
    });
  }

  for (const card of cards) {
    await prisma.card.upsert({
      where: { system_key: card.system_key },
      update: {
        title: card.title,
        body: card.body,
        category: card.category as CardCategory,
        intensity: card.intensity as CardIntensity,
        position: card.position,
        is_invertible: card.is_invertible,
        requires_video: card.requires_video,
        receiver_rule: card.receiver_rule as ReceiverRule,
      },
      create: {
        deck_id: deck.id,
        system_key: card.system_key,
        title: card.title,
        body: card.body,
        category: card.category as CardCategory,
        intensity: card.intensity as CardIntensity,
        position: card.position,
        is_invertible: card.is_invertible,
        requires_video: card.requires_video,
        receiver_rule: card.receiver_rule as ReceiverRule,
      }
    });
  }
  
  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
