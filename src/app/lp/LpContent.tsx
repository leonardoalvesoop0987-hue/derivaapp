"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Heart, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";

export function LpContent() {
  const [showToast, setShowToast] = useState(false);

  const handleBuyClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border border-copper/30 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 w-[90%] max-w-md"
          >
            <div className="w-2 h-2 rounded-full bg-copper animate-pulse" />
            <p className="text-sm font-medium text-text-primary">
              Compra online em ativação. Em breve você poderá finalizar o pedido por aqui.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-wine/20 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="relative z-10">
          <span className="inline-block py-1 px-3 rounded-full border border-copper/30 bg-copper/10 text-copper text-xs font-semibold tracking-widest uppercase mb-8">
            Para Casais Adultos
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-text-primary leading-tight">
            Uma noite diferente não precisa começar <br className="hidden md:block" /> com uma grande ideia.
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            O Deriva é um deck sensual para casais adultos que guia a noite com cartas leves, provocantes e progressivamente mais quentes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleBuyClick}
              className="w-full sm:w-auto bg-red-deep hover:bg-wine text-text-primary font-medium px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-deep/25"
            >
              Comprar versão física <ChevronRight size={18} />
            </button>
            <p className="text-copper font-medium text-lg ml-2">Por apenas R$ 19,90</p>
          </div>
        </motion.div>
      </section>

      {/* Benefícios */}
      <section className="py-24 bg-background-secondary px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sair da rotina nunca foi tão simples</h2>
            <p className="text-text-secondary max-w-xl mx-auto">Crie o clima perfeito sem constrangimentos ou pressões. Deixe que a experiência conduza o momento.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Heart className="text-copper" size={28} />, title: "Mais intimidade", desc: "Abra espaço para uma conexão mais profunda, redescobrindo o parceiro no tempo de vocês." },
              { icon: <Sparkles className="text-copper" size={28} />, title: "Clima natural", desc: "Acabe com a pressão de 'ter que fazer algo diferente'. O deck entrega a condução de forma leve." },
              { icon: <Flame className="text-copper" size={28} />, title: "Mais desejo", desc: "Aumente a expectativa com provocações que constroem a tensão ideal para a noite." }
            ].map((b, i) => (
              <motion.div 
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 + 0.2 } } }}
                className="bg-card p-8 rounded-2xl border border-border"
              >
                <div className="w-14 h-14 rounded-xl bg-background-primary flex items-center justify-center mb-6">
                  {b.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{b.title}</h3>
                <p className="text-text-secondary leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ritmo Dela */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <span className="text-copper font-semibold tracking-wider text-sm uppercase mb-3 block">Presença Absoluta</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Pensado especialmente para o ritmo dela</h2>
            <p className="text-text-secondary text-lg mb-6 leading-relaxed">
              O Deriva não tem pressa. Cada detalhe foi estruturado com um foco especial no ritmo da mulher, fazendo-a se sentir desejada, observada, conduzida e, acima de tudo, no centro de toda a experiência.
            </p>
            <ul className="space-y-4">
              {['Construção do desejo sem atalhos', 'Ela no centro da experiência', 'Condução mútua, porém focada nela'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-text-primary">
                  <CheckCircle2 size={20} className="text-red-deep" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="relative h-[400px] rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-card to-background-primary flex items-center justify-center"
          >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
             <div className="w-32 h-48 bg-wine/30 rounded-lg shadow-2xl border border-copper/20 rotate-[-10deg] absolute"></div>
             <div className="w-32 h-48 bg-card rounded-lg shadow-2xl border border-copper/40 rotate-[5deg] absolute flex flex-col justify-between p-4">
               <div className="w-full h-1 bg-copper/30 rounded-full"></div>
               <div className="flex justify-center"><Heart size={24} className="text-copper/50" /></div>
               <div className="space-y-2">
                 <div className="w-full h-2 bg-text-secondary/20 rounded-full"></div>
                 <div className="w-2/3 h-2 bg-text-secondary/20 rounded-full"></div>
               </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Como funciona & Intensidade */}
      <section className="py-24 bg-background-secondary px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Progressão Natural</h2>
            <p className="text-text-secondary text-lg mb-16">
              A melhor noite não é a que começa pelo mais intenso. É aquela que escala perfeitamente. O deck dita o ritmo da sua experiência de forma fluida.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 relative">
             <div className="hidden sm:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-copper/10 via-copper/40 to-red-deep/40 -z-10 -translate-y-1/2"></div>
             
             {[
               { level: "1", title: "Aquecimento", desc: "Cartas leves para quebrar o gelo e trazer vocês para o momento presente." },
               { level: "2", title: "Provocação", desc: "Toques e olhares ganham intenção. A temperatura sobe sutilmente." },
               { level: "3", title: "Intensidade", desc: "Cartas mais quentes para quando o clima já foi totalmente estabelecido." }
             ].map((step, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                 className="bg-background-primary border border-border p-6 rounded-2xl flex flex-col items-center"
               >
                 <div className="w-12 h-12 rounded-full bg-card border border-copper/30 flex items-center justify-center font-bold text-copper text-xl mb-4">
                   {step.level}
                 </div>
                 <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                 <p className="text-sm text-text-secondary">{step.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Oferta Final */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-deep/10 pointer-events-none" />
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="max-w-2xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Traga essa experiência para a vida real</h2>
          <p className="text-xl text-text-secondary mb-10">
            Receba a versão física em casa e tenha em mãos o guia perfeito para a sua próxima noite especial.
          </p>
          <div className="bg-card border border-copper/30 p-8 rounded-3xl mb-8">
            <span className="block text-text-secondary mb-2 uppercase tracking-wider text-sm font-semibold">Investimento</span>
            <span className="text-5xl font-bold text-text-primary block mb-6">R$ 19,90</span>
            <button 
              onClick={handleBuyClick}
              className="w-full bg-red-deep hover:bg-wine text-text-primary font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-red-deep/20"
            >
              Comprar versão física
            </button>
            <p className="text-sm text-text-secondary mt-4">Entrega discreta em todo o Brasil.</p>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background-secondary px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "O conteúdo é muito explícito?", a: "Não. A proposta do Deriva é elegância e progressão. Não usamos linguagem chula ou vulgar." },
              { q: "A entrega é discreta?", a: "Sim, 100%. A embalagem externa não tem menções sobre o que é o produto ou o nome da loja." },
              { q: "Demora quanto tempo para chegar?", a: "O prazo depende do seu CEP, mas os pedidos são despachados em até 24 horas úteis após a confirmação." }
            ].map((faq, i) => (
              <div key={i} className="bg-card p-6 rounded-2xl border border-border">
                <h3 className="text-lg font-semibold mb-2 text-copper">{faq.q}</h3>
                <p className="text-text-secondary">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-background-primary text-center">
        <p className="text-text-secondary text-sm">
          &copy; {new Date().getFullYear()} Deriva. Todos os direitos reservados.
        </p>
        <p className="text-text-secondary/50 text-xs mt-2">
          Proibido para menores de 18 anos.
        </p>
      </footer>
    </div>
  );
}
