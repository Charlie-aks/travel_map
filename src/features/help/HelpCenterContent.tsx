"use client";

import { Search, Rocket, Map as MapIcon, CalendarHeart, ShieldAlert, Lock, MessageSquare, Mail, Users, ChevronDown, Compass } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";

export function HelpCenterContent() {
  const { t } = useTranslation();

  return (
    <div className="w-full pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[320px] bg-slate-900 overflow-hidden">
        {/* Background Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM95cyRmldZVxkuz_lO4AjZTgGq01V_RbRc5XbwnydVnuPoTGzc39HmZueKaRX13GPquNmJgp8Fn0odlBX_F-araqLr5ytUAzIQDo_zDtZfWRFzwsrYSSDF0cp_1mjjsrVC2hlMJZFZIu4wZ3X-Bxr-ecVcl8C0Rpx0Fr87OFSnmbsynnycPek2Fws1w2JRV-Nzjhi7BT6GcpQDQYU-kDsjaXfZ-tqq1F3xV-f2JFkrANul_PNQ2NDBEQTdMav3BsGCsqWKqc9di4" 
          alt="Phan Thiet Beach" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#f8fafc] to-transparent h-20 bottom-0 top-auto"></div>
        
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-8 tracking-tight drop-shadow-md">
            {t.help.heroTitle}
          </h1>
          
          <div className="w-full max-w-2xl relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0077b6] transition-colors" />
            <input 
              type="text" 
              placeholder={t.help.searchPlaceholder}
              className="w-full h-16 pl-14 pr-32 rounded-full border-0 focus:ring-4 focus:ring-[#0077b6]/30 shadow-2xl text-lg font-medium text-slate-700 dark:text-slate-100 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md outline-none transition-all placeholder:text-slate-400"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0077b6] dark:bg-[#38bdf8] hover:bg-[#005f92] dark:hover:bg-[#7dd3fc] text-white dark:text-slate-900 px-6 py-3 rounded-full font-bold shadow-md transition-all active:scale-95">
              {t.help.searchButton}
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto px-6 md:px-12 -mt-10 relative z-20 space-y-16">
        
        {/* 2. Knowledge Base */}
        <section>
          <div className="mb-6 ml-2">
            <h4 className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-[#0077b6] dark:text-[#38bdf8] mb-2 transition-colors">{t.help.knowledgeBase}</h4>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-50 transition-colors">{t.help.commonTopics}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Main large card */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-all relative overflow-hidden group cursor-pointer">
              <div className="bg-[#e6f3fb] dark:bg-[#e6f3fb]/10 w-12 h-12 rounded-2xl flex items-center justify-center text-[#0077b6] dark:text-[#38bdf8] mb-6 shadow-sm transition-colors">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50 mb-3 tracking-tight transition-colors">{t.help.gettingStarted}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm mb-6 transition-colors">
                {t.help.gettingStartedDesc}
              </p>
              <span className="text-sm font-extrabold text-[#0077b6] group-hover:text-[#005f92] flex items-center gap-2">
                {t.help.viewArticles} <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
              </span>
              
              <Compass className="absolute -bottom-8 -right-8 w-40 h-40 text-slate-50 opacity-50 group-hover:scale-110 transition-transform duration-500" />
            </div>

            {/* Small cards */}
            {[
              { icon: MapIcon, title: t.help.cards.mapTitle, desc: t.help.cards.mapDesc, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30" },
              { icon: CalendarHeart, title: t.help.cards.bookingTitle, desc: t.help.cards.bookingDesc, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/30" },
              { icon: ShieldAlert, title: t.help.cards.safetyTitle, desc: t.help.cards.safetyDesc, color: "text-[#0077b6] dark:text-[#38bdf8]", bg: "bg-blue-50 dark:bg-[#0077b6]/20" },
              { icon: Lock, title: t.help.cards.accountTitle, desc: t.help.cards.accountDesc, color: "text-slate-600 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800" }
            ].map((card, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col">
                <div className={`${card.bg} w-10 h-10 rounded-xl flex items-center justify-center ${card.color} mb-4 transition-colors`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-50 mb-2 transition-colors">{card.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4 flex-1 transition-colors">
                  {card.desc}
                </p>
                <span className={`text-xs font-extrabold transition-colors ${card.color} opacity-80 group-hover:opacity-100`}>{t.help.cards.readMore}</span>
              </div>
            ))}

          </div>
        </section>

        {/* 3. FAQ Accordion section */}
        <FAQSection />

        {/* 4. Support Options */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Hero Card */}
          <div className="relative rounded-[2rem] overflow-hidden h-64 lg:h-full shadow-lg group">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80" alt="Customer Support" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
             <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
             <div className="absolute bottom-8 left-8 text-white">
                <p className="text-[10px] font-extrabold tracking-widest uppercase text-blue-200 mb-1">{t.help.humanSupport}</p>
                <h3 className="text-2xl font-extrabold tracking-tight">{t.help.alwaysHere}</h3>
             </div>
          </div>

          {/* Right Contacts */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-50 mb-2 transition-colors">{t.help.supportTitle}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm transition-colors">{t.help.supportDesc}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-[#0077b6] dark:text-[#38bdf8] transition-colors"><MessageSquare className="w-5 h-5" /></div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm transition-colors">{t.help.digitalConcierge}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">{t.help.digitalConciergeDesc}</p>
                    </div>
                 </div>
                 <button className="text-[#0077b6] dark:text-[#38bdf8] font-bold text-sm hover:underline transition-colors">{t.help.startChat}</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#f8f6f0] dark:bg-[#f8f6f0]/10 flex items-center justify-center text-[#9c8441] dark:text-[#d3ad48] transition-colors"><Mail className="w-5 h-5" /></div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm transition-colors">{t.help.emailSupport}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">{t.help.emailSupportDesc}</p>
                    </div>
                 </div>
                 <button className="text-[#0077b6] dark:text-[#38bdf8] font-bold text-sm hover:underline transition-colors">{t.help.sendEmail}</button>
              </div>

              {/* Blue Community Card */}
              <div className="bg-[#0077b6] rounded-2xl p-6 shadow-lg text-white relative overflow-hidden mt-4">
                <Users className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10" />
                <div className="relative z-10">
                  <h4 className="font-bold text-lg mb-2">{t.help.travelerCommunity}</h4>
                  <p className="text-blue-100 text-sm mb-6 max-w-sm">{t.help.travelerCommunityDesc}</p>
                  <button className="bg-white text-[#0077b6] font-bold py-2.5 px-6 rounded-full shadow-md hover:bg-slate-50 transition-colors text-sm">
                    {t.help.joinForum}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 pb-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 dark:text-slate-500 font-medium transition-colors">
           <div>
             <span className="font-bold text-slate-800 dark:text-slate-300 transition-colors">{t.help.footerText}</span> <br className="md:hidden" />
             {t.help.footerRights}
           </div>
           <div className="flex gap-4 mt-4 md:mt-0">
             <span className="hover:text-slate-600 dark:hover:text-slate-400 cursor-pointer transition-colors">{t.help.privacyPolicy}</span>
             <span className="hover:text-slate-600 dark:hover:text-slate-400 cursor-pointer transition-colors">{t.help.termsOfService}</span>
             <span className="hover:text-slate-600 dark:hover:text-slate-400 cursor-pointer transition-colors">{t.help.cookiePolicy}</span>
           </div>
        </footer>

      </div>
    </div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useTranslation();

  return (
    <section className="bg-slate-100/50 dark:bg-slate-900/30 px-6 md:px-12 py-16 -mx-6 md:-mx-12 rounded-[3rem] transition-colors">
      <div className="text-center mb-10 max-w-lg mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-50 mb-3 tracking-tight transition-colors">{t.help.faqTitle}</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">{t.help.faqDesc}</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {t.help.faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <motion.div 
              key={idx}
              layout
              className={`bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border ${isOpen ? 'border-[#0077b6]/30 dark:border-[#38bdf8]/30 shadow-md' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'} transition-colors cursor-pointer`}
            >
              <button 
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base pr-8 transition-colors">{faq.q}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-blue-50 dark:bg-blue-900/30 text-[#0077b6] dark:text-[#38bdf8]' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  >
                    <div className="px-6 pb-6 pt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium transition-colors">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
