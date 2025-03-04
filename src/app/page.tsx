// src/app/page.tsx
"use client";

export const dynamic = "force-dynamic";

import { motion } from "framer-motion";
import Navbar from "./components/Navbar";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="overflow-hidden bg-yellow-300">
        {/* Hero - ATTENTION */}
        <section className="min-h-screen flex items-center relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center px-4 relative"
          >
            <motion.div
              variants={itemVariants}
              className="text-7xl font-black mb-8 transform -rotate-2"
              style={{ textShadow: "4px 4px 0px #000" }}
            >
              TON CERVEAU EST EN
              <br />
              <span className="text-6xl bg-black text-red-500 px-4 py-2 inline-block rotate-1">
                MODE PANIQUE
              </span>
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="text-2xl mb-8 font-bold bg-black text-white px-6 py-3 transform rotate-1 inline-block"
            >
              😱 Tu oublies tout • Tu procrastines • Tu stress TOUT LE TEMPS
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="text-xl font-bold mb-8 bg-white p-4 border-4 border-black transform -rotate-1"
            >
              Et si je te disais qu'on peut réparer tout ça en 21 jours ?
              <br/>
              <span className="text-sm">(Sans méditation ni huiles essentielles douteuses)</span>
            </motion.div>
          </motion.div>
        </section>

        {/* PROBLÈME & AGITATION */}
        <section className="py-20 bg-white">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto px-4"
          >
            <h2 className="text-5xl font-black mb-16 text-center transform -rotate-1">
              <span className="bg-black text-white px-4 py-2 inline-block">
                TON CERVEAU TE FAIT LA GUERRE
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="p-6 bg-red-400 border-4 border-black"
              >
                <h3 className="text-2xl font-black mb-4">🤯 MODE CHAOS</h3>
                <p className="font-bold">
                  Ton cerveau ressemble à un appart étudiant un dimanche matin.
                  Un vrai bazar qui t'empêche d'être productif.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="p-6 bg-orange-400 border-4 border-black"
              >
                <h3 className="text-2xl font-black mb-4">🦥 MODE PARESSE</h3>
                <p className="font-bold">
                  Ta to-do list te nargue pendant que tu regardes ta 47ème vidéo
                  de chats sur TikTok.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="p-6 bg-purple-400 border-4 border-black"
              >
                <h3 className="text-2xl font-black mb-4">😰 MODE PANIQUE</h3>
                <p className="font-bold">
                  Ton anxiété a son propre compte Instagram et plus d'abonnés que toi.
                  C'est dire.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* SOLUTION */}
        <section className="py-20 bg-black text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto px-4"
          >
            <h2 className="text-5xl font-black mb-16 text-center">
              <span className="bg-yellow-300 text-black px-4 py-2 inline-block transform rotate-1">
                LA SOLUTION : ÉCRITURE = SUPER-POUVOIRS
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="p-6 bg-white text-black border-4 border-yellow-300"
              >
                <div className="text-3xl mb-4">🧠 Mode Boost Activé</div>
                <p className="text-xl font-bold">
                  L'écriture, c'est comme du RedBull pour ton cerveau, mais sans les ailes ni les palpitations.
                  21 jours = cerveau neuf.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="p-6 bg-white text-black border-4 border-yellow-300"
              >
                <div className="text-3xl mb-4">🎮 Mode Jeu</div>
                <p className="text-xl font-bold">
                  Des challenges quotidiens plus addictifs que les séries Netflix.
                  Bonus : tu deviens intelligent en même temps.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Social Proof - DÉSIR */}
        <section className="py-20 bg-gradient-to-r from-purple-400 via-yellow-300 to-green-400">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto px-4"
          >
            <h2 className="text-5xl font-black mb-16 text-center">
              <span className="bg-black text-white px-4 py-2 inline-block transform -rotate-2">
                ILS SONT PASSÉS DU CÔTÉ LUMINEUX
              </span>
            </h2>

            {/* Stats Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-black text-white p-6 mb-12 text-center"
            >
              <p className="text-2xl font-black">
                +10 000 cerveaux optimisés • 93% de satisfaction • 21 jours pour changer
              </p>
            </motion.div>

            {/* Testimonials Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="p-6 bg-white border-4 border-black"
              >
                <div className="text-3xl mb-4">🧠 +43% de mémoire</div>
                <p className="text-xl font-bold">
                  "J'ai commencé à me souvenir des anniversaires de TOUTE ma famille.
                  Même de mon beau-frère que je déteste !"
                </p>
                <p className="mt-4 font-black">- Marie K, Développeuse</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="p-6 bg-white border-4 border-black"
              >
                <div className="text-3xl mb-4">💪 +38% de productivité</div>
                <p className="text-xl font-bold">
                  "Je finis mes journées de travail à 15h maintenant.
                  Mon patron pense que je prends des substances illégales."
                </p>
                <p className="mt-4 font-black">- Thomas R, Entrepreneur</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="p-6 bg-white border-4 border-black"
              >
                <div className="text-3xl mb-4">🤯 Clarté mentale</div>
                <p className="text-xl font-bold">
                  "Après 21 jours, j'ai réalisé que mon travail était toxique.
                  J'ai démissionné. Maintenant je vis dans une yourte et je suis heureuse."
                </p>
                <p className="mt-4 font-black">- Camille B, Ex-consultante</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="p-6 bg-white border-4 border-black"
              >
                <div className="text-3xl mb-4">💰 Économies réalisées</div>
                <p className="text-xl font-bold">
                  "Écrire mes pulsions d'achat avant de valider mon panier m'a fait économiser 3420€ en deux mois.
                  Amazon me déteste !"
                </p>
                <p className="mt-4 font-black">- Julie F, Raisonnable</p>
              </motion.div>
            </div>

            {/* Additional Testimonials with Different Style */}
            <div className="mt-12 grid md:grid-cols-2 gap-8">
            <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="p-6 bg-white border-4 border-black"
              >
                <div className="text-3xl mb-4">🔑 Organisation</div>
                <p className="text-xl font-bold">
                  "Avant, je perdais mes clés 3 fois par jour. Maintenant je les perds qu'une fois !
                  C'est ça le progrès 🚀"
                </p>
                <p className="mt-4 font-black">- Kevin L, Plus vraiment tête en l'air</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="p-6 bg-white border-4 border-black"
              >
                <div className="text-3xl mb-4">🎯 Focus</div>
                <p className="text-xl font-bold">
                  "J'ai enfin fini cette série Netflix que je regardais depuis 2019.
                  Et en plus, je me souviens de l'intrigue !"
                </p>
                <p className="mt-4 font-black">- Sarah M, Focus Master</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* CTA Final - ACTION */}
        <section className="py-20 bg-black text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center px-4"
          >
            <h2 className="text-6xl font-black mb-8">
              <span className="bg-yellow-300 text-black px-4 py-2 inline-block transform -rotate-2">
                RÉVEILLE LA BÊTE
              </span>
            </h2>
            <p className="text-2xl mb-8 font-bold bg-white text-black p-4 inline-block transform rotate-1">
              21 jours pour passer de "cerveau Windows 95" à "cerveau NASA"
            </p>
            <div className="mb-8 text-lg">
              <span className="bg-red-500 text-white px-2 py-1 font-bold">ATTENTION</span>
              <span className="text-yellow-300 font-bold"> Plus que 7 places en mode GRATUIT aujourd'hui</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-black bg-yellow-300 text-black px-8 py-4 rounded-none border-4 border-yellow-300 hover:bg-white transition-all"
            >
              TRANSFORMER MON CERVEAU →
            </motion.button>
            <p className="mt-4 text-sm font-bold">
              Garantie "Pas Content, Remboursé" pendant 21 jours
            </p>
          </motion.div>
        </section>
      </div>
    </>
  );
}