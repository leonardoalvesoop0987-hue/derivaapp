export type QuestionType = "single_choice" | "multi_choice" | "scale_0_10" | "text";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: { value: string; label: string }[];
  note?: string;
  audience: "WOMAN" | "MAN";
}

export const alignmentQuestionsVersion = "2026-06-v1";

export const womanQuestions: Question[] = [
  {
    id: "w01",
    audience: "WOMAN",
    type: "single_choice",
    text: "Como você se sente entrando em uma experiência guiada por cartas?",
    options: [
      { value: "A", label: "Curiosa e animada." },
      { value: "B", label: "Um pouco tímida, mas aberta a testar." },
      { value: "C", label: "Insegura, preciso que seja bem leve no começo." },
      { value: "D", label: "Não sei ainda, quero entender melhor antes." }
    ]
  },
  {
    id: "w02",
    audience: "WOMAN",
    type: "single_choice",
    text: "Você sente que seu parceiro demonstra desejo por você?",
    options: [
      { value: "A", label: "Sim, me sinto desejada." },
      { value: "B", label: "Sim, mas às vezes tenho dúvidas." },
      { value: "C", label: "Pouco, eu gostaria de sentir mais isso." },
      { value: "D", label: "Não sei responder com clareza." }
    ]
  },
  {
    id: "w03",
    audience: "WOMAN",
    type: "single_choice",
    text: "Qual é seu nível atual de desejo sexual pelo seu parceiro?",
    options: [
      { value: "A", label: "Alto." },
      { value: "B", label: "Médio." },
      { value: "C", label: "Baixo." },
      { value: "D", label: "Varia muito conforme o momento, o clima e minha cabeça." }
    ]
  },
  {
    id: "w04",
    audience: "WOMAN",
    type: "single_choice",
    text: "Você gosta de ser conduzida aos poucos antes de chegar em algo mais intenso?",
    options: [
      { value: "A", label: "Sim, isso é importante para mim." },
      { value: "B", label: "Sim, mas às vezes gosto de algo mais direto." },
      { value: "C", label: "Depende do dia." },
      { value: "D", label: "Não, prefiro que vá direto ao ponto." }
    ]
  },
  {
    id: "w05",
    audience: "WOMAN",
    type: "single_choice",
    text: "Massagens, toques lentos e aproximação gradual costumam funcionar para você?",
    options: [
      { value: "A", label: "Sim, gosto muito." },
      { value: "B", label: "Gosto, mas não sempre." },
      { value: "C", label: "Não faz tanta diferença." },
      { value: "D", label: "Não gosto muito." }
    ]
  },
  {
    id: "w06",
    audience: "WOMAN",
    type: "single_choice",
    text: "Beijos, abraços e carinho durante o sexo são importantes para você?",
    options: [
      { value: "A", label: "Sim, muito." },
      { value: "B", label: "Gosto, mas não precisa ser sempre." },
      { value: "C", label: "Não faço questão." },
      { value: "D", label: "Às vezes me incomoda quando quebra o ritmo." }
    ]
  },
  {
    id: "w07",
    audience: "WOMAN",
    type: "single_choice",
    text: "Você se sente confortável em receber comandos ou sugestões do app durante a sessão?",
    options: [
      { value: "A", label: "Sim, acho interessante." },
      { value: "B", label: "Sim, desde que não seja pesado demais no início." },
      { value: "C", label: "Talvez, preciso testar." },
      { value: "D", label: "Não gosto muito da ideia." }
    ]
  },
  {
    id: "w08",
    audience: "WOMAN",
    type: "single_choice",
    text: "Como você prefere a progressão da sessão?",
    options: [
      { value: "A", label: "Sempre mais leve." },
      { value: "B", label: "Começar leve e ir esquentando aos poucos." },
      { value: "C", label: "Começar já mais quente, mas com cuidado." },
      { value: "D", label: "Depende do dia." }
    ]
  },
  {
    id: "w09",
    audience: "WOMAN",
    type: "single_choice",
    text: "Você aceita que o Deriva sugira posições, ritmos e formas de condução?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, desde que eu possa pular quando não quiser." },
      { value: "C", label: "Talvez, dependendo do tipo de sugestão." },
      { value: "D", label: "Não." }
    ]
  },
  {
    id: "w10",
    audience: "WOMAN",
    type: "single_choice",
    text: "Você gosta da ideia de ter pausas de respiro, carinho ou reconexão no meio da experiência?",
    options: [
      { value: "A", label: "Sim, acho importante." },
      { value: "B", label: "Sim, desde que não esfrie demais." },
      { value: "C", label: "Tanto faz." },
      { value: "D", label: "Não, prefiro manter o clima quente direto." }
    ]
  },
  {
    id: "w11",
    audience: "WOMAN",
    type: "single_choice",
    text: "Frases provocantes ou mais picantes durante o sexo costumam te excitar?",
    options: [
      { value: "A", label: "Sim, gosto." },
      { value: "B", label: "Gosto, mas com moderação." },
      { value: "C", label: "Tenho vergonha, mas tenho curiosidade." },
      { value: "D", label: "Não gosto." }
    ]
  },
  {
    id: "w12",
    audience: "WOMAN",
    type: "single_choice",
    text: "Você já quis falar algo mais picante, mas travou por vergonha?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Não." },
      { value: "C", label: "Talvez, mas não sei se teria coragem." }
    ]
  },
  {
    id: "w13",
    audience: "WOMAN",
    type: "single_choice",
    text: "Você já ouviu algo na hora do sexo que achou pesado demais?",
    options: [
      { value: "A", label: "Sim, e não gostei." },
      { value: "B", label: "Sim, mas gostei." },
      { value: "C", label: "Não, nunca aconteceu." },
      { value: "D", label: "Não sei dizer." }
    ]
  },
  {
    id: "w14",
    audience: "WOMAN",
    type: "single_choice",
    text: "Você acha que fantasias, simulações e imaginação podem aumentar o desejo do casal?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, mas com limites claros." },
      { value: "C", label: "Talvez, nunca explorei muito." },
      { value: "D", label: "Não gosto dessa ideia." }
    ]
  },
  {
    id: "w15",
    audience: "WOMAN",
    type: "single_choice",
    text: "Sobre imaginar situações durante o sexo, o que parece aceitável para você?",
    options: [
      { value: "A", label: "Apenas fantasias sem terceiros." },
      { value: "B", label: "Fantasias com terceiros fictícios, sem nomes reais." },
      { value: "C", label: "Imaginação livre, desde que ninguém precise revelar nada." },
      { value: "D", label: "Não gosto de envolver esse tipo de imaginação." }
    ]
  },
  {
    id: "w16",
    audience: "WOMAN",
    type: "single_choice",
    text: "Você já imaginou alguma situação diferente durante o sexo, mesmo sem intenção de viver isso na realidade?",
    options: [
      { value: "A", label: "Sim, com outra mulher." },
      { value: "B", label: "Sim, com outro homem." },
      { value: "C", label: "Sim, com mais de uma pessoa na fantasia." },
      { value: "D", label: "Sim, mas prefiro não classificar." },
      { value: "E", label: "Não, nunca imaginei." }
    ],
    note: "Imaginar algo não significa querer fazer na vida real."
  },
  {
    id: "w17",
    audience: "WOMAN",
    type: "multi_choice",
    text: "O que seria inaceitável para você em fantasias ou simulações?",
    options: [
      { value: "A", label: "Pessoas conhecidas do casal." },
      { value: "B", label: "Amigos ou amigas." },
      { value: "C", label: "Colegas de trabalho, academia ou estudo." },
      { value: "D", label: "Ex-relacionamentos." },
      { value: "E", label: "Parentes ou qualquer coisa ligada a família." },
      { value: "F", label: "Situações com humilhação pesada." },
      { value: "G", label: "Situações de violência, coerção ou medo real." },
      { value: "H", label: "Prefiro não envolver terceiros nem fictícios." }
    ]
  },
  {
    id: "w18",
    audience: "WOMAN",
    type: "single_choice",
    text: "Você aceitaria simulações de papéis, desde que fossem claramente adultas, consensuais e sem pessoas reais conhecidas?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, mas só as mais leves." },
      { value: "C", label: "Talvez, preciso testar." },
      { value: "D", label: "Não." }
    ]
  },
  {
    id: "w19",
    audience: "WOMAN",
    type: "scale_0_10",
    text: "Classifique de 0 a 10 seu nível de interesse nestas atuações:",
    options: [
      { value: "A", label: "Massagista e cliente." },
      { value: "B", label: "Profissional de saúde e paciente adulto." },
      { value: "C", label: "Dois desconhecidos adultos em hotel." },
      { value: "D", label: "Professor(a) e aluno(a) adulto(a)." },
      { value: "E", label: "Personal trainer e aluna(o) adulta(o)." },
      { value: "F", label: "Policial e suspeita adulta, sem violência real." },
      { value: "G", label: "Amantes fictícios." },
      { value: "H", label: "Cliente e acompanhante adulta(o)." },
      { value: "I", label: "Entregador e cliente adulta(o)." },
      { value: "J", label: "Fisioterapeuta e paciente adulta(o)." }
    ],
    note: "Todas as opções são apenas simulações adultas e consensuais."
  },
  {
    id: "w20",
    audience: "WOMAN",
    type: "single_choice",
    text: "Sobre vídeos adultos em algumas cartas, qual é sua posição?",
    options: [
      { value: "A", label: "Tenho curiosidade e acho que pode aumentar o clima." },
      { value: "B", label: "Aceito testar se estiver bem encaixado na carta." },
      { value: "C", label: "Tenho dúvidas, mas não descarto." },
      { value: "D", label: "Não quero vídeos adultos." }
    ]
  },
  {
    id: "w21",
    audience: "WOMAN",
    type: "single_choice",
    text: "Caso vídeos adultos sejam usados, qual estilo parece menos desconfortável para você?",
    options: [
      { value: "A", label: "Lésbico, mais lento e focado no prazer feminino." },
      { value: "B", label: "Casal homem e mulher, com estética mais discreta." },
      { value: "C", label: "FFM ou MMF, desde que não pareça agressivo ou vulgar." },
      { value: "D", label: "Não sei." },
      { value: "E", label: "Nenhum, prefiro sem vídeos." }
    ]
  },
  {
    id: "w22",
    audience: "WOMAN",
    type: "single_choice",
    text: "Você aceitaria vídeos adultos como estímulo visual em cartas específicas, sem que eles substituam o foco no casal?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, mas só em momentos específicos." },
      { value: "C", label: "Talvez." },
      { value: "D", label: "Não." }
    ]
  },
  {
    id: "w23",
    audience: "WOMAN",
    type: "single_choice",
    text: "Você se sentiria desconfortável se seu parceiro assistisse a vídeo adulto enquanto você participa da cena real?",
    options: [
      { value: "A", label: "Sim, eu não gostaria." },
      { value: "B", label: "Depende do tipo de vídeo e da carta." },
      { value: "C", label: "Não vejo problema se o foco continuar em nós." },
      { value: "D", label: "Não sei." }
    ]
  },
  {
    id: "w24",
    audience: "WOMAN",
    type: "single_choice",
    text: "Sobre brinquedos eróticos, qual opção se aproxima mais de você?",
    options: [
      { value: "A", label: "Tenho e aceito usar." },
      { value: "B", label: "Não tenho, mas tenho curiosidade." },
      { value: "C", label: "Tenho, mas não gosto muito." },
      { value: "D", label: "Não tenho e não quero usar." }
    ]
  },
  {
    id: "w25",
    audience: "WOMAN",
    type: "multi_choice",
    text: "Quais tipos de carta você aceitaria testar?",
    options: [
      { value: "A", label: "Massagens eróticas e relaxantes." },
      { value: "B", label: "Momentos de carinho e conexão." },
      { value: "C", label: "Sexo oral." },
      { value: "D", label: "Sexo vaginal." },
      { value: "E", label: "Sexo anal." },
      { value: "F", label: "Uso das mãos e dedos." },
      { value: "G", label: "Vídeos adultos." },
      { value: "H", label: "Provocações verbais." },
      { value: "I", label: "Fantasias e imaginação." },
      { value: "J", label: "Bebida ou pequenos brindes durante a sessão." },
      { value: "K", label: "Dominação leve." },
      { value: "L", label: "Proibição temporária de toque ou penetração." },
      { value: "M", label: "Simulação de papéis adultos." },
      { value: "N", label: "Música ambiente sensual." }
    ]
  },
  {
    id: "w26",
    audience: "WOMAN",
    type: "text",
    text: "Há algo que você considera limite absoluto?",
    note: "Se não quiser, escreva 'Prefiro não responder agora'."
  },
  {
    id: "w27",
    audience: "WOMAN",
    type: "single_choice",
    text: "Você prefere que coisas feitas na sessão sejam mencionadas fora do momento íntimo?",
    options: [
      { value: "A", label: "Não, prefiro deixar só para a hora." },
      { value: "B", label: "Sim, gosto de lembrar e provocar depois." },
      { value: "C", label: "Depende do assunto." },
      { value: "D", label: "Prefiro que ele pergunte antes." }
    ]
  },
  {
    id: "w28",
    audience: "WOMAN",
    type: "single_choice",
    text: "Você aceitaria cartas com sugestões românticas ou carinhosas para o dia seguinte?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, mas sem exagero." },
      { value: "C", label: "Talvez." },
      { value: "D", label: "Não." }
    ]
  },
  {
    id: "w29",
    audience: "WOMAN",
    type: "single_choice",
    text: "Você aceitaria sugestões para momentos fora da cama, como jantar, passeio, treino ou lazer juntos?",
    options: [
      { value: "A", label: "Sim, acho interessante." },
      { value: "B", label: "Sim, desde que não vire obrigação." },
      { value: "C", label: "Talvez." },
      { value: "D", label: "Não." }
    ]
  },
  {
    id: "w30",
    audience: "WOMAN",
    type: "single_choice",
    text: "Com que frequência você acha saudável usar o Deriva?",
    options: [
      { value: "A", label: "1 vez por semana." },
      { value: "B", label: "1 a 2 vezes por semana." },
      { value: "C", label: "Apenas em ocasiões especiais." },
      { value: "D", label: "Quando der vontade, sem regra fixa." }
    ]
  },
  {
    id: "w31",
    audience: "WOMAN",
    type: "single_choice",
    text: "Qual frase combina mais com o que você espera do Deriva?",
    options: [
      { value: "A", label: "Quero perder um pouco a vergonha e me soltar mais com meu parceiro." },
      { value: "B", label: "Quero sentir que ele me deseja mais." },
      { value: "C", label: "Quero sair da rotina sem parecer forçado." },
      { value: "D", label: "Quero experimentar algo mais quente, mas com segurança." },
      { value: "E", label: "Quero fortalecer uma relação que já é importante para mim." }
    ]
  },
  {
    id: "w32",
    audience: "WOMAN",
    type: "text",
    text: "O que você gostaria que o Deriva ajudasse seu parceiro a entender melhor sobre você?"
  }
];

export const manQuestions: Question[] = [
  {
    id: "m01",
    audience: "MAN",
    type: "single_choice",
    text: "Como você se sente entrando em uma experiência guiada por cartas?",
    options: [
      { value: "A", label: "Animado e curioso." },
      { value: "B", label: "Acho interessante, mas quero entender melhor." },
      { value: "C", label: "Um pouco inseguro, mas aberto a testar." },
      { value: "D", label: "Não sei ainda." }
    ]
  },
  {
    id: "m02",
    audience: "MAN",
    type: "single_choice",
    text: "Você sente que sua parceira demonstra desejo por você?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, mas às vezes tenho dúvidas." },
      { value: "C", label: "Pouco, eu gostaria de sentir mais." },
      { value: "D", label: "Não sei responder." }
    ]
  },
  {
    id: "m03",
    audience: "MAN",
    type: "single_choice",
    text: "Qual é seu nível atual de desejo sexual pela sua parceira?",
    options: [
      { value: "A", label: "Alto." },
      { value: "B", label: "Médio." },
      { value: "C", label: "Baixo." },
      { value: "D", label: "Varia muito conforme o momento." }
    ]
  },
  {
    id: "m04",
    audience: "MAN",
    type: "single_choice",
    text: "Você gosta da ideia de o Deriva conduzir parte da noite para você não precisar improvisar tudo?",
    options: [
      { value: "A", label: "Sim, isso ajuda muito." },
      { value: "B", label: "Sim, mas quero manter liberdade." },
      { value: "C", label: "Talvez." },
      { value: "D", label: "Não gosto de ser conduzido por app." }
    ]
  },
  {
    id: "m05",
    audience: "MAN",
    type: "single_choice",
    text: "Você entende que a progressão gradual pode ser importante para ela entrar mais no clima?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, mas às vezes tenho dificuldade de ter paciência." },
      { value: "C", label: "Nunca pensei muito nisso." },
      { value: "D", label: "Não concordo muito." }
    ]
  },
  {
    id: "m06",
    audience: "MAN",
    type: "single_choice",
    text: "Você gosta de fazer massagens, beijos e aproximação lenta antes de algo mais intenso?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, mas nem sempre." },
      { value: "C", label: "Não tenho muita paciência, mas posso tentar." },
      { value: "D", label: "Não gosto muito." }
    ]
  },
  {
    id: "m07",
    audience: "MAN",
    type: "single_choice",
    text: "Você se sente confortável em receber comandos ou sugestões do app durante a sessão?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, se fizer sentido." },
      { value: "C", label: "Talvez." },
      { value: "D", label: "Não." }
    ]
  },
  {
    id: "m08",
    audience: "MAN",
    type: "single_choice",
    text: "Como você prefere a progressão da sessão?",
    options: [
      { value: "A", label: "Sempre mais leve." },
      { value: "B", label: "Começar leve e ir esquentando." },
      { value: "C", label: "Mais quente desde o início." },
      { value: "D", label: "Depende do dia." }
    ]
  },
  {
    id: "m09",
    audience: "MAN",
    type: "single_choice",
    text: "Você aceitaria que algumas cartas coloquem ela no comando?",
    options: [
      { value: "A", label: "Sim, gosto da ideia." },
      { value: "B", label: "Sim, desde que não seja sempre." },
      { value: "C", label: "Talvez." },
      { value: "D", label: "Não gosto." }
    ]
  },
  {
    id: "m10",
    audience: "MAN",
    type: "single_choice",
    text: "Você aceitaria cartas em que você precisa conduzir com mais calma e atenção ao ritmo dela?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, mesmo que seja um desafio para mim." },
      { value: "C", label: "Talvez." },
      { value: "D", label: "Não." }
    ]
  },
  {
    id: "m11",
    audience: "MAN",
    type: "single_choice",
    text: "Frases provocantes ou mais picantes durante o sexo costumam te excitar?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, com moderação." },
      { value: "C", label: "Tenho curiosidade, mas travo." },
      { value: "D", label: "Não gosto." }
    ]
  },
  {
    id: "m12",
    audience: "MAN",
    type: "single_choice",
    text: "Você já falou algo que depois achou que poderia ter sido pesado demais?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Talvez." },
      { value: "C", label: "Não." },
      { value: "D", label: "Nunca falei frases muito picantes." }
    ]
  },
  {
    id: "m13",
    audience: "MAN",
    type: "single_choice",
    text: "Você concorda que fantasia e imaginação podem aumentar o desejo do casal?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, mas com limites." },
      { value: "C", label: "Talvez." },
      { value: "D", label: "Não." }
    ]
  },
  {
    id: "m14",
    audience: "MAN",
    type: "single_choice",
    text: "Sobre fantasias, o que parece aceitável para você?",
    options: [
      { value: "A", label: "Apenas fantasias sem terceiros." },
      { value: "B", label: "Terceiros fictícios, sem nomes reais." },
      { value: "C", label: "Imaginação livre, sem revelar detalhes." },
      { value: "D", label: "Não gosto desse tipo de fantasia." }
    ]
  },
  {
    id: "m15",
    audience: "MAN",
    type: "multi_choice",
    text: "O que seria inaceitável para você em fantasias ou simulações?",
    options: [
      { value: "A", label: "Pessoas conhecidas do casal." },
      { value: "B", label: "Amigos ou amigas." },
      { value: "C", label: "Colegas de trabalho, academia ou estudo." },
      { value: "D", label: "Ex-relacionamentos." },
      { value: "E", label: "Parentes ou qualquer coisa ligada a família." },
      { value: "F", label: "Humilhação pesada." },
      { value: "G", label: "Violência, coerção ou medo real." },
      { value: "H", label: "Prefiro não envolver terceiros nem fictícios." }
    ]
  },
  {
    id: "m16",
    audience: "MAN",
    type: "single_choice",
    text: "Você aceitaria simulações de papéis adultos, consensuais e sem pessoas reais conhecidas?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, mas só as mais leves." },
      { value: "C", label: "Talvez." },
      { value: "D", label: "Não." }
    ]
  },
  {
    id: "m17",
    audience: "MAN",
    type: "scale_0_10",
    text: "Classifique seu interesse nestas atuações de 0 a 10:",
    options: [
      { value: "A", label: "Massagista e cliente." },
      { value: "B", label: "Profissional de saúde e paciente adulto." },
      { value: "C", label: "Dois desconhecidos adultos em hotel." },
      { value: "D", label: "Professor(a) e aluno(a) adulto(a)." },
      { value: "E", label: "Personal trainer e aluna(o) adulta(o)." },
      { value: "F", label: "Policial e suspeita adulta, sem violência real." },
      { value: "G", label: "Amantes fictícios." },
      { value: "H", label: "Cliente e acompanhante adulta(o)." },
      { value: "I", label: "Entregador e cliente adulta(o)." },
      { value: "J", label: "Fisioterapeuta e paciente adulta(o)." }
    ]
  },
  {
    id: "m18",
    audience: "MAN",
    type: "single_choice",
    text: "Sobre vídeos adultos em algumas cartas, qual é sua posição?",
    options: [
      { value: "A", label: "Acho interessante e pode aumentar o clima." },
      { value: "B", label: "Aceito testar se estiver bem encaixado." },
      { value: "C", label: "Tenho dúvidas, mas não descarto." },
      { value: "D", label: "Não quero vídeos adultos." }
    ]
  },
  {
    id: "m19",
    audience: "MAN",
    type: "single_choice",
    text: "Se houver vídeo adulto em algumas cartas, o que parece mais aceitável para você?",
    options: [
      { value: "A", label: "FFM." },
      { value: "B", label: "Casal homem e mulher." },
      { value: "C", label: "Lésbico." },
      { value: "D", label: "Não sei." },
      { value: "E", label: "Nenhum, prefiro sem vídeos." }
    ]
  },
  {
    id: "m20",
    audience: "MAN",
    type: "single_choice",
    text: "Você entende que vídeos adultos, quando usados, devem servir para provocar o casal e não substituir o foco nela?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, e acho importante." },
      { value: "C", label: "Nunca pensei nisso." },
      { value: "D", label: "Não concordo." }
    ]
  },
  {
    id: "m21",
    audience: "MAN",
    type: "single_choice",
    text: "Você aceitaria que algumas cartas priorizem o prazer dela antes do seu?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, desde que também existam cartas para mim." },
      { value: "C", label: "Talvez." },
      { value: "D", label: "Não." }
    ]
  },
  {
    id: "m22",
    audience: "MAN",
    type: "multi_choice",
    text: "Quais tipos de carta você aceitaria testar?",
    options: [
      { value: "A", label: "Massagens eróticas e relaxantes." },
      { value: "B", label: "Momentos de carinho e conexão." },
      { value: "C", label: "Sexo oral." },
      { value: "D", label: "Sexo vaginal." },
      { value: "E", label: "Sexo anal." },
      { value: "F", label: "Uso das mãos e dedos." },
      { value: "G", label: "Vídeos adultos." },
      { value: "H", label: "Provocações verbais." },
      { value: "I", label: "Fantasias e imaginação." },
      { value: "J", label: "Bebida ou pequenos brindes durante a sessão." },
      { value: "K", label: "Dominação leve." },
      { value: "L", label: "Proibição temporária de toque ou penetração." },
      { value: "M", label: "Simulação de papéis adultos." },
      { value: "N", label: "Música ambiente sensual." }
    ]
  },
  {
    id: "m23",
    audience: "MAN",
    type: "text",
    text: "Há algo que você considera limite absoluto?",
    note: "Se não quiser, escreva 'Prefiro não responder agora'."
  },
  {
    id: "m24",
    audience: "MAN",
    type: "single_choice",
    text: "Você prefere que coisas feitas na sessão sejam mencionadas fora do momento íntimo?",
    options: [
      { value: "A", label: "Não, prefiro deixar só para a hora." },
      { value: "B", label: "Sim, gosto de lembrar e provocar depois." },
      { value: "C", label: "Depende do assunto." },
      { value: "D", label: "Prefiro que ela pergunte antes." }
    ]
  },
  {
    id: "m25",
    audience: "MAN",
    type: "single_choice",
    text: "Você aceitaria cartas com sugestões românticas ou carinhosas para o dia seguinte?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, mas sem exagero." },
      { value: "C", label: "Talvez." },
      { value: "D", label: "Não." }
    ]
  },
  {
    id: "m26",
    audience: "MAN",
    type: "single_choice",
    text: "Você aceitaria sugestões para momentos fora da cama, como jantar, passeio, treino ou lazer juntos?",
    options: [
      { value: "A", label: "Sim." },
      { value: "B", label: "Sim, desde que não vire obrigação." },
      { value: "C", label: "Talvez." },
      { value: "D", label: "Não." }
    ]
  },
  {
    id: "m27",
    audience: "MAN",
    type: "single_choice",
    text: "Com que frequência você acha saudável usar o Deriva?",
    options: [
      { value: "A", label: "1 vez por semana." },
      { value: "B", label: "1 a 2 vezes por semana." },
      { value: "C", label: "Apenas em ocasiões especiais." },
      { value: "D", label: "Quando der vontade, sem regra fixa." }
    ]
  },
  {
    id: "m28",
    audience: "MAN",
    type: "single_choice",
    text: "Qual frase combina mais com o que você espera do Deriva?",
    options: [
      { value: "A", label: "Quero ver ela mais solta e confiante comigo." },
      { value: "B", label: "Quero sentir que ela também me deseja." },
      { value: "C", label: "Quero sair da rotina sem parecer forçado." },
      { value: "D", label: "Quero experimentar algo mais quente, mas com segurança." },
      { value: "E", label: "Quero fortalecer uma relação que já é importante para mim." }
    ]
  },
  {
    id: "m29",
    audience: "MAN",
    type: "text",
    text: "O que você gostaria que o Deriva ajudasse sua parceira a entender melhor sobre você?"
  },
  {
    id: "m30",
    audience: "MAN",
    type: "multi_choice",
    text: "O que você gostaria de melhorar em você mesmo durante a intimidade?",
    options: [
      { value: "A", label: "Ter mais calma." },
      { value: "B", label: "Prestar mais atenção aos sinais dela." },
      { value: "C", label: "Falar mais o que sinto ou desejo." },
      { value: "D", label: "Ter mais iniciativa." },
      { value: "E", label: "Me soltar mais." },
      { value: "F", label: "Não sei ainda." }
    ]
  }
];
