"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "É muito pesado ou vulgar?",
      a: "Não. O Deriva foi criado para ser adulto, elegante e progressivo. A linguagem é madura e foca na construção do desejo e da intimidade, sem apelar para a vulgaridade."
    },
    {
      q: "Dá para usar se a pessoa for mais tímida?",
      a: "Com certeza. As cartas iniciais (Azuis) foram desenhadas justamente para quebrar o gelo sem pressão. A experiência respeita o ritmo do casal e não força situações constrangedoras."
    },
    {
      q: "Precisa usar todas as cartas em uma noite?",
      a: "Não. Você pode encerrar a sessão a qualquer momento ou usar uma sessão 'Curta'. O ideal é parar quando o clima chegar ao ponto que vocês desejam."
    },
    {
      q: "Tem cartas leves?",
      a: "Sim, muitas. Cartas de respiro, conversas instigantes, toques sutis e provocações mentais. Elas são a base para construir o clima antes da intensidade subir."
    },
    {
      q: "Tem cartas mais quentes?",
      a: "Sim. A medida que a progressão avança (níveis Intenso e Pico), as cartas ficam mais explícitas na intenção e no toque, mas sempre exigindo o consentimento do casal."
    },
    {
      q: "O foco é só na mulher?",
      a: "Não. O Deriva tem um foco especial no ritmo dela porque isso costuma melhorar a experiência dos dois. Mas a proposta é o casal inteiro entrar no clima: ela se sente mais desejada, ele se sente mais provocado, e os dois participam da construção da noite."
    },
    {
      q: "O homem também participa da experiência?",
      a: "Totalmente. Para ele, o maior benefício é o fim da 'obrigação de improvisar'. Ele participa ativamente conduzindo a parceira de forma guiada, o que tira a pressão e aumenta o tesão mútuo."
    },
    {
      q: "O app é necessário?",
      a: "A versão física funciona sozinha, mas o app eleva muito a experiência. O algoritmo do app garante que os sorteios sigam uma progressão matemática impecável, evitando repetições."
    },
    {
      q: "Por que usar o app se existe versão física?",
      a: "O app permite uso imediato (antes da versão física chegar), gerencia a música ambiente, mostra mídia interativa quando necessário e garante que não falte criatividade na progressão."
    },
    {
      q: "Tem vídeos adultos?",
      a: "Sim. Algumas cartas podem exibir vídeos curtos no app como parte da provocação e da ambientação visual para entrar no clima. Não é o centro da experiência."
    },
    {
      q: "Os vídeos são obrigatórios?",
      a: "De forma alguma. Eles podem ser totalmente ignorados ou desligados nas configurações iniciais da sessão. O casal faz a própria regra."
    },
    {
      q: "Tem música?",
      a: "O app possui integração com um sistema de áudio interno e contínuo. As músicas variam de relaxantes a intensas para criar a trilha sonora perfeita sem sair da tela."
    },
    {
      q: "É para casal em crise?",
      a: "Não é uma terapia para casais em crise ou para salvar relacionamentos. É uma ferramenta de prazer para casais que já escolheram estar juntos e querem apenas combater a rotina e melhorar a intimidade."
    },
    {
      q: "Serve para casamento longo?",
      a: "Sim, especialmente para eles. A rotina é natural, e o Deriva devolve a faísca e a novidade para quem já conhece perfeitamente as manias do parceiro, sem parecer forçado."
    },
    {
      q: "A entrega é discreta?",
      a: "100% discreta. A caixa que chega na sua casa é parda, lisa e sem logomarcas chamativas. Apenas você saberá o que há dentro."
    },
    {
      q: "O botão de compra já funciona?",
      a: "No momento, a compra online está em ativação final. O botão permite demonstrar o interesse, e muito em breve o checkout direto estará liberado."
    }
  ];

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
        
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-card border rounded-2xl overflow-hidden transition-colors ${openIndex === index ? 'border-copper/50' : 'border-border'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-semibold text-text-primary pr-8">{faq.q}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-copper shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-2 text-text-secondary leading-relaxed text-[15px]">
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
