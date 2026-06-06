"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "O que eu recebo ao comprar hoje?", a: "Você garante acesso vitalício e imediato ao Aplicativo Deriva PWA, e nós enviaremos a versão física do baralho premium para o seu endereço de cadastro. Você pode começar a jogar hoje mesmo pelo celular enquanto a caixa física viaja até você." },
    { q: "O envio é discreto?", a: "100% discreto. A caixa externa de envio é parda, lisa e sem nenhuma logomarca, nome do produto ou indicação do conteúdo. O remetente é apenas um nome corporativo padrão. Apenas você saberá o que tem lá dentro." },
    { q: "A compra é segura?", a: "Sim. Utilizamos o Stripe, uma das maiores e mais seguras plataformas de pagamento do mundo, como nosso processador financeiro. Seus dados de cartão não ficam armazenados em nossos servidores." },
    { q: "O Deriva tem alguma mensalidade?", a: "Não. O pagamento é único. Você compra o baralho físico + acesso ao app e não precisa pagar assinatura ou mensalidade. Todas as atualizações futuras de sistema estão inclusas." },
    { q: "É muito vulgar ou agressivo?", a: "De forma alguma. O Deriva foi desenhado com um foco clínico e elegante. A linguagem é madura e foca na construção do desejo. A intensidade sobe aos poucos, mas nunca apela para a vulgaridade gratuita." },
    { q: "Dá para usar se formos mais tímidos?", a: "Sim, e é justamente por isso que o Deriva funciona. As cartas iniciais (Deck Azul) são feitas para quebrar o gelo sem pressão. Tudo começa com conversas e toques sutis. Ninguém precisa virar outra pessoa para jogar." },
    { q: "Serve para casais de longo prazo?", a: "Especialmente para vocês. A rotina costuma silenciar o desejo, mesmo em relacionamentos saudáveis. O Deriva é um atalho para voltar a conversar sobre intimidade e sentir frio na barriga sem o peso da 'DR'." },
    { q: "O homem também gosta de jogar?", a: "Muito. Um dos maiores feedbacks dos homens é o alívio. O Deriva tira do homem a 'obrigação de sempre improvisar e conduzir'. Ele se sente guiado, provocando a parceira de forma certeira, enquanto foca apenas no prazer." },
    { q: "Funciona no iPhone e Android?", a: "Sim! O app é um PWA (Progressive Web App). Você acessa direto pelo navegador (Safari ou Chrome), faz login e adiciona o ícone à tela inicial. Ele funciona como um aplicativo nativo, rápido e fluido." },
    { q: "Precisa de internet para jogar?", a: "Para o primeiro login e para salvar o alinhamento de privacidade, sim. Mas após baixar e sincronizar os decks, a engine principal do jogo pode rodar localmente no seu celular para que vocês não sejam interrompidos." },
    { q: "E se a carta pedir algo que não queremos fazer?", a: "Vocês têm controle total. O jogo possui um botão de 'Pular'. Além disso, antes de jogar, vocês respondem a um formulário privado de alinhamento que já remove do baralho o que for limite absoluto para vocês." },
    { q: "Nossa privacidade no app está garantida?", a: "Sim. O sistema utiliza tokens seguros, senhas criptografadas e banco de dados isolado no PostgreSQL. As respostas do formulário de alinhamento são vinculadas ao casal e inacessíveis externamente." },
    { q: "O que é a categoria 'Tons mais escuros'?", a: "É um grupo avançado de cartas (envolvendo fantasias de terceiros, fetiches específicos ou ciúme consentido). Esse conteúdo vem TOTALMENTE BLOQUEADO por padrão. Vocês só desbloqueiam manualmente se quiserem ir para esse caminho." },
    { q: "Podemos criar o nosso próprio deck?", a: "Sim. No app, vocês podem montar um Deck Personalizado, escolhendo a dedo quais cartas das categorias (Azul, Rosa, Vermelha, etc.) querem incluir naquela noite específica." },
    { q: "Qual o prazo de entrega do baralho físico?", a: "O prazo varia conforme o seu CEP, mas geralmente leva de 5 a 12 dias úteis via transportadora. O código de rastreio é enviado por e-mail." },
    { q: "As cartas físicas têm a mesma ordem do app?", a: "A versão física permite que vocês embaralhem manualmente, mas o app usa um Algoritmo de Sorteio Inteligente que garante uma progressão matemática impecável. É por isso que recomendamos usar o App." },
    { q: "O que acontece se a gente não chegar até a última carta?", a: "O objetivo não é 'zerar' o baralho. O objetivo é a conexão. Vocês podem encerrar o jogo a qualquer momento se o clima esquentar a ponto de vocês não quererem mais ler nada. O jogo cumpriu seu papel." },
    { q: "Tem vídeos dentro do app?", a: "Algumas cartas podem exibir vídeos curtos e estéticos para ajudar na ambientação. Eles não são obrigatórios e podem ser desativados nas configurações." },
    { q: "O app tem música?", a: "Sim. Nós criamos uma integração de áudio ambiente no app, onde as frequências e ritmos mudam conforme a intensidade do jogo aumenta, aprofundando a imersão." },
    { q: "Tem alguma garantia?", a: "Sim. Você tem a garantia incondicional de 7 dias, conforme a lei do consumidor. Se achar que a experiência não é para o seu relacionamento, basta solicitar o reembolso." }
  ];

  return (
    <section className="py-24 lg:py-32 bg-[var(--color-background-primary)] px-6 relative border-t border-[var(--color-border)]">
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[var(--color-wine)]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 lg:mb-20">
          <span className="text-[var(--color-copper)] text-sm uppercase tracking-[0.2em] font-medium mb-4 block">Tire suas dúvidas</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white">Perguntas Frequentes</h2>
        </div>
        
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-[var(--color-card)]/50 backdrop-blur-sm border transition-all duration-300 ${openIndex === index ? 'border-[var(--color-copper)]/50 rounded-2xl shadow-[0_0_20px_rgba(184,115,51,0.05)]' : 'border-[var(--color-border)] rounded-xl hover:border-[var(--color-copper)]/20'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
              >
                <span className={`font-serif text-lg pr-8 transition-colors ${openIndex === index ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>{faq.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openIndex === index ? 'bg-[var(--color-copper)]/10 text-[var(--color-copper)]' : 'bg-white/5 text-white/50 group-hover:bg-white/10'}`}>
                  <ChevronDown 
                    size={18} 
                    className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                  />
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-2 text-[var(--color-text-secondary)] font-light leading-relaxed text-[15px] border-t border-[var(--color-border)]/30 mt-2">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
