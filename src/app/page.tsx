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
        {/* Hero avec un style néobrutalist */}
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
              className="text-8xl font-black mb-8 transform -rotate-2"
              style={{ textShadow: "4px 4px 0px #000" }}
            >
              BOOST TON CERVEAU
              <br />
              <span className="text-6xl bg-black text-yellow-300 px-4 py-2 inline-block rotate-1">
                EN ÉCRIVANT
              </span>
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="text-2xl mb-8 font-bold bg-black text-white px-6 py-3 transform rotate-1 inline-block"
            >
              🧠 Un cerveau plus performant en 21 jours ou remboursé
            </motion.p>
            <motion.button
              variants={itemVariants}
              className="text-2xl font-black bg-black text-white px-8 py-4 rounded-none border-4 border-black hover:bg-yellow-300 hover:text-black transition-all transform hover:-translate-y-1 hover:rotate-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              COMMENCER L'AVENTURE →
            </motion.button>
          </motion.div>
        </section>

        {/* Section Avantages avec style brutal */}
        <section className="py-20 bg-white">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto px-4"
          >
            <h2 className="text-5xl font-black mb-16 text-center transform -rotate-1">
              <span className="bg-black text-white px-4 py-2 inline-block">
                POURQUOI ÇA MARCHE ?
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="p-6 bg-pink-400 border-4 border-black"
              >
                <h3 className="text-2xl font-black mb-4">🔥 NEUROPLASTICITÉ</h3>
                <p className="font-bold">
                  L'écriture active 7 zones de ton cerveau simultanément.
                  C'est comme un CrossFit cérébral quotidien.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="p-6 bg-blue-400 border-4 border-black"
              >
                <h3 className="text-2xl font-black mb-4">⚡️ EFFET COMPOUND</h3>
                <p className="font-bold">
                  21 jours = nouvelles connexions neuronales.
                  3 mois = transformation cognitive complète.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="p-6 bg-green-400 border-4 border-black"
              >
                <h3 className="text-2xl font-black mb-4">🎯 GAMIFICATION</h3>
                <p className="font-bold">
                  Challenges quotidiens, récompenses et compétition amicale.
                  Développe ton cerveau en t'amusant.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Section Social Proof */}
        <section className="py-20 bg-black text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto px-4"
          >
            <h2 className="text-5xl font-black mb-16 text-center">
              <span className="bg-yellow-300 text-black px-4 py-2 inline-block transform rotate-1">
                ILS SONT DEVENUS DES GÉNIES
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8 ">
              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="p-6 bg-white text-black border-4 border-yellow-300"
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
                className="p-6 bg-white text-black border-4 border-yellow-300"
              >
                <div className="text-3xl mb-4">💪 +38% de productivité</div>
                <p className="text-xl font-bold">
                  "Je finis mes journées de travail à 15h maintenant.
                  Mon patron pense que je prends des substances illégales."
                </p>
                <p className="mt-4 font-black">- Thomas R, Entrepreneur</p>
              </motion.div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="p-6 bg-white text-black border-4 border-yellow-300"
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
                className="p-6 bg-white text-black border-4 border-yellow-300"
              >
                <div className="text-3xl mb-4">💰 Économies réalisées</div>
                <p className="text-xl font-bold">
                  "Écrire mes pulsions d'achat avant de valider mon panier m'a fait économiser 3420€ en deux mois.
                  Amazon me déteste !"
                </p>
                <p className="mt-4 font-black">- Julie F, Raisonnable</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Section Prix avec style brutal */}
        <section className="py-20 bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto px-4"
          >
            <h2 className="text-5xl font-black mb-16 text-center">
              <span className="bg-black text-white px-4 py-2 inline-block transform -rotate-2">
                CHOISIS TON NIVEAU DE GÉNIE
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -1 }}
                className="p-6 bg-white border-4 border-black text-center relative overflow-hidden"
              >
                <div className="text-2xl font-black mb-4">CERVEAU BASIQUE</div>
                <div className="text-5xl font-black mb-6">Gratuit</div>
                <ul className="mb-8 space-y-4 text-lg font-bold">
                  <li>✍️ Écriture limitée à 500 mots/jour</li>
                  <li>📊 Mode Zen basique</li>
                  <li>🎯 Stats personnelles simples</li>
                  <li>🏆 1 badge à débloquer</li>
                  <li>📊 Accès au classement</li>
                </ul>
                <button className="w-full bg-black text-white font-black py-3 px-6 hover:bg-yellow-300 hover:text-black transition-all">
                  COMMENCER
                </button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="p-6 bg-yellow-300 border-4 border-black text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 font-black transform rotate-12">
                  POPULAIRE
                </div>
                <div className="text-2xl font-black mb-4">CERVEAU ÉVEILLÉ</div>
                <div className="text-5xl font-black mb-6">2.99€/mois</div>
                <ul className="mb-8 space-y-4 text-lg font-bold">
                  <li>✨ Écriture illimitée</li>
                  <li>📝 Tous les modes d'écriture</li>
                  <li>🎭 Analyse émotionnelle détaillée</li>
                  <li>🏆 Tous les badges</li>
                  <li>📤 Export des textes</li>
                  <li>🚫 Sans publicité</li>
                </ul>
                <button className="w-full bg-black text-white font-black py-3 px-6 hover:bg-white hover:text-black transition-all">
                  DEVENIR ÉVEILLÉ
                </button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotate: -1 }}
                className="p-6 bg-white border-4 border-black text-center"
              >
                <div className="text-2xl font-black mb-4">CERVEAU ULTIME</div>
                <div className="text-5xl font-black mb-6">7.99€/mois</div>
                <ul className="mb-8 space-y-4 text-lg font-bold">
                  <li>✨ Tout le contenu Éveillé</li>
                  <li>📊 Statistiques avancées</li>
                  <li>🎯 Prompts personnalisés</li>
                  <li>🏆 Challenges hebdomadaires exclusifs</li>
                  <li>👥 Mode collaboration</li>
                </ul>
                <button className="w-full bg-black text-white font-black py-3 px-6 hover:bg-yellow-300 hover:text-black transition-all">
                DEVENIR AUGMENTÉ
                </button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* CTA Final avec style brutal */}
        <section className="py-20 bg-black text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center px-4"
          >
            <h2 className="text-6xl font-black mb-8">
              <span className="bg-yellow-300 text-black px-4 py-2 inline-block transform -rotate-2">
                PRÊT À DEVENIR UN GÉNIE ?
              </span>
            </h2>
            <p className="text-2xl mb-8 font-bold">
              Rejoins +10 000 personnes qui ont boosté leur cerveau avec LexiStep
            </p>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-black bg-yellow-300 text-black px-8 py-4 rounded-none border-4 border-yellow-300 hover:bg-white transition-all"
            >
              COMMENCER MAINTENANT →
            </motion.button>
          </motion.div>
        </section>
      </div>
    </>
  );
}