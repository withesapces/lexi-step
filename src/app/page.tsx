"use client";

export const dynamic = "force-dynamic";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import PublicNavbar from "./components/PublicNavbar";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [isScrolling, setIsScrolling] = useState(false);
  const mainRef = useRef(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const promptTimerRef = useRef(null);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"]
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleProgress = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Floating writing prompt
  const writingPrompts = [
    "Qu'est-ce qui t'empêche de dormir la nuit ?",
    "Si tu pouvais résoudre un problème aujourd'hui...",
    "Décris ton succès idéal dans un an",
    "Qu'est-ce qui t'a vraiment rendu heureux récemment ?",
    "Quel est ton plus grand rêve inavoué ?"
  ];

  const [currentPrompt, setCurrentPrompt] = useState(0);

  // Timer animation for the writing demo
  useEffect(() => {
    const promptInterval = setInterval(() => {
      setCurrentPrompt(prev => (prev + 1) % writingPrompts.length);
    }, 4000);

    const dayInterval = setInterval(() => {
      setCurrentDay(prev => (prev % 21) + 1);
    }, 1500);

    return () => {
      clearInterval(promptInterval);
      clearInterval(dayInterval);
    };
  }, []);

  // Scroll tracking for specific animations
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Détecte si l'utilisateur scrolle vers le bas et a dépassé 300px
      if (currentScrollY > 300 && currentScrollY > lastScrollY) {
        setShowPrompt(true);

        // Démarre le timer pour faire disparaître le prompt
        clearTimeout(promptTimerRef.current);
        setPromptVisible(true);

        promptTimerRef.current = setTimeout(() => {
          setPromptVisible(false);
        }, 5000); // Le prompt reste visible 5 secondes après le dernier scroll
      }

      // Mise à jour de la position du dernier scroll
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(promptTimerRef.current);
    };
  }, [lastScrollY]);

  // Random brain facts for the science section ticker
  const brainFacts = [
    "Écrire 20 minutes par jour réduit le stress de 23%",
    "L'écriture régulière améliore la mémoire de travail de 17%",
    "86% des personnes qui écrivent quotidiennement rapportent une meilleure clarté mentale",
    "L'écriture avant de dormir améliore la qualité du sommeil de 28%",
    "Les journaux intimes réduisent les symptômes d'anxiété de jusqu'à 37%"
  ];

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

  const floatingButtonVariants = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [0, -10, 0],
      rotate: [-1, 1, -1],
      transition: {
        y: { repeat: Infinity, duration: 2 },
        rotate: { repeat: Infinity, duration: 3 }
      }
    }
  };

  return (
    <>
      {session ? <Navbar /> : <PublicNavbar />}
      <main ref={mainRef} className="overflow-hidden">
        {/* Sticky Writing Prompt - Appears when scrolling */}
        <AnimatePresence>
          {showPrompt && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: promptVisible ? 0 : "100%", opacity: promptVisible ? 1 : 0 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed bottom-8 right-8 z-50"
            >
              <div className="bg-black text-white p-4 border-2 border-yellow-300 shadow-lg max-w-xs">
                <p className="text-sm font-bold">PROMPT DU JOUR:</p>
                <p className="text-lg italic">"{writingPrompts[currentPrompt]}"</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-yellow-300 text-sm hover:underline mt-2"
                >
                  Écris maintenant →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating CTA Button */}
        <motion.div
          className="fixed bottom-8 left-8 z-40 hidden md:block"
          variants={floatingButtonVariants}
          initial="initial"
          animate="animate"
        >
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-6 py-3 font-bold border-4 border-yellow-300 shadow-lg hover:bg-yellow-300 hover:text-black transition-all"
          >
            COMMENCE TON DÉFI
          </button>
        </motion.div>

        {/* Hero Section with Parallax */}
        <section className="min-h-screen flex items-center relative overflow-hidden">
          <motion.div
            style={{ opacity: backgroundOpacity }}
            className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"
          />

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
              LIBÈRE TON ESPRIT
              <br />
              <span className="text-6xl bg-black text-yellow-300 px-4 py-2 inline-block rotate-1">
                UNE PAGE À LA FOIS
              </span>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative p-6 bg-white border-4 border-black mb-8 max-w-2xl mx-auto transform rotate-1"
            >
              <h3 className="text-lg font-black mb-2">TON CERVEAU EST COMME UN NAVIGATEUR AVEC 100 ONGLETS OUVERTS</h3>
              <p className="font-bold text-xl mb-2">
                Et tu te demandes pourquoi tu es épuisé, anxieux et démotivé ?
              </p>
              <p className="italic">
                L'écriture quotidienne est la seule méthode scientifiquement prouvée pour "fermer les onglets" de ton esprit.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="text-xl font-bold bg-black text-white px-8 py-3 rounded-none border-4 border-black hover:bg-white hover:text-black transition-all"
              >
                COMMENCER GRATUITEMENT →
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-sm font-bold bg-green-400 px-4 py-2 border-2 border-black"
              >
                <span className="bg-white px-2 py-1 text-black">+2,341</span> personnes cette semaine
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Animated Ticker/Scroller with Brain Facts */}
        <div className="bg-black text-white py-3 overflow-hidden whitespace-nowrap">
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: "-50%" }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear"
            }}
            className="inline-block"
          >
            {brainFacts.map((fact, index) => (
              <span key={index} className="text-lg font-bold mx-8">
                • {fact} •
              </span>
            ))}
            {brainFacts.map((fact, index) => (
              <span key={index + "repeat"} className="text-lg font-bold mx-8">
                • {fact} •
              </span>
            ))}
          </motion.div>
        </div>

        {/* Before/After Split Section */}
        <section className="bg-white py-20 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto px-4"
          >
            <h2 className="text-5xl font-black mb-16 text-center transform -rotate-1">
              <motion.span
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-black text-white px-4 py-2 inline-block shadow-lg"
              >
                AVANT/APRÈS: TON ESPRIT
              </motion.span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 relative">
              {/* Animated Divider */}
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute left-1/2 top-0 bottom-0 w-1 bg-black transform -translate-x-1/2 hidden md:block"
              ></motion.div>

              {/* Before Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-red-100 p-8 border-4 border-black relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
              >
                <div className="absolute -top-6 -left-6 bg-black text-white p-3 font-black text-xl transform rotate-3 shadow-md">
                  AVANT
                </div>
                <ul className="space-y-4">
                  {/* Staggered animation for list items */}
                  {[
                    "Pensées en boucle incessantes",
                    "Anxiété qui paralyse tes décisions",
                    "Difficulté à te concentrer plus de 5 minutes",
                    "Fatigue mentale chronique",
                    "Procrastination constante"
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index + 0.3 }}
                      viewport={{ once: true }}
                      className="flex items-center group"
                    >
                      <span className="text-2xl mr-3 text-red-600 group-hover:scale-125 transition-transform duration-300">❌</span>
                      <span className="font-bold">{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 bg-white border-2 border-black italic relative"
                >
                  <div className="absolute -top-3 -left-3 bg-red-200 h-6 w-6 rounded-full border-2 border-black"></div>
                  "Je me sentais dépassé(e) par mes pensées en permanence. Mon cerveau ne s'arrêtait jamais."
                </motion.div>
              </motion.div>

              {/* After Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-green-100 p-8 border-4 border-black relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
              >
                <div className="absolute -top-6 -left-6 bg-black text-white p-3 font-black text-xl transform -rotate-3 shadow-md">
                  APRÈS
                </div>
                <ul className="space-y-4">
                  {/* Staggered animation for list items */}
                  {[
                    "Clarté mentale impressionnante",
                    "Réduction de l'anxiété de 75%",
                    "Capacité à rester concentré(e) pendant des heures",
                    "Énergie mentale toute la journée",
                    "Productivité accrue de 32%"
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: 20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index + 0.3 }}
                      viewport={{ once: true }}
                      className="flex items-center group"
                    >
                      <span className="text-2xl mr-3 text-green-600 group-hover:scale-125 transition-transform duration-300">✅</span>
                      <span className="font-bold">{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 bg-white border-2 border-black italic relative"
                >
                  <div className="absolute -top-3 -left-3 bg-green-200 h-6 w-6 rounded-full border-2 border-black"></div>
                  "21 jours plus tard, je me sens comme si quelqu'un avait nettoyé mes pensées. Je peux ENFIN respirer mentalement."
                </motion.div>
              </motion.div>
            </div>

            {/* Add comparison toggle for mobile */}
            <div className="mt-8 md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-black text-white font-bold text-lg border-2 border-black"
              >
                VOIR LA COMPARAISON
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="bg-yellow-300 py-20 relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto px-4"
          >
            <h2 className="text-5xl font-black mb-16 text-center">
              <span className="bg-black text-white px-4 py-2 inline-block transform rotate-1">
                COMMENT ÇA MARCHE ?
              </span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white p-8 border-4 border-black text-center"
              >
                <div className="bg-black text-yellow-300 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">1</div>
                <h3 className="font-bold text-xl mb-4">ÉCRIS 20 MINUTES</h3>
                <p>Chaque jour, pendant 21 jours, tu réponds à un prompt scientifiquement conçu pour décharger ton esprit.</p>
                <div className="mt-4">
                  <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 mx-auto bg-[url('/pen.svg')] bg-contain bg-no-repeat bg-center"
                  />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white p-8 border-4 border-black text-center md:mt-8"
              >
                <div className="bg-black text-yellow-300 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">2</div>
                <h3 className="font-bold text-xl mb-4">OBSERVE LES PATTERNS</h3>
                <p>Notre IA analyse subtilement ton écriture pour identifier les schémas de pensée limitants.</p>
                <div className="mt-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-16 h-16 mx-auto bg-[url('/brain.svg')] bg-contain bg-no-repeat bg-center"
                  />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white p-8 border-4 border-black text-center md:mt-16"
              >
                <div className="bg-black text-yellow-300 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">3</div>
                <h3 className="font-bold text-xl mb-4">TRANSFORME TON ESPRIT</h3>
                <p>Après 21 jours, tu auras libéré ton esprit et transformé ta relation avec tes pensées.</p>
                <div className="mt-4">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 mx-auto bg-[url('/rocket.svg')] bg-contain bg-no-repeat bg-center"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Scientific Backing */}
        <section className="bg-white py-20 relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto px-4"
          >
            <h2 className="text-5xl font-black mb-16 text-center">
              <span className="bg-black text-white px-4 py-2 inline-block transform -rotate-1">
                LA SCIENCE DERRIÈRE LA MÉTHODE
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <div className="border-l-4 border-black pl-4">
                    <h3 className="font-bold text-xl">Effet de Pennebaker</h3>
                    <p>L'écriture expressive réduit l'activité dans l'amygdale, réduisant l'anxiété de 37% en moyenne.</p>
                  </div>

                  <div className="border-l-4 border-black pl-4">
                    <h3 className="font-bold text-xl">Neuroplasticité ciblée</h3>
                    <p>21 jours d'écriture créent de nouveaux chemins neuronaux qui deviennent automatiques et permanents.</p>
                  </div>

                  <div className="border-l-4 border-black pl-4">
                    <h3 className="font-bold text-xl">Système limbique calibré</h3>
                    <p>L'externalisation des pensées réduit l'hyperactivité du système limbique de 42%.</p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="relative aspect-square"
              >
                <div className="absolute inset-0 bg-yellow-300 rounded-full transform -rotate-6"></div>
                <div className="absolute inset-2 bg-white rounded-full border-4 border-black transform rotate-3 flex items-center justify-center">
                  <div className="text-center max-w-xs">
                    <div className="font-black text-6xl mb-2">87%</div>
                    <p className="font-bold text-xl">des utilisateurs constatent une amélioration significative de leur santé mentale après 21 jours</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="bg-black text-white py-20 relative">

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto px-4"
          >
            <h2 className="text-5xl font-black mb-16 text-center">
              <span className="bg-yellow-300 text-black px-4 py-2 inline-block transform rotate-1">
                ILS ONT TRANSFORMÉ LEUR ESPRIT
              </span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white text-black p-6 border-4 border-yellow-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-bold">Sophie M.</p>
                    <p className="text-sm">Développeuse web</p>
                  </div>
                </div>
                <p className="italic">"Depuis que j'écris tous les jours, j'ai tellement vidé mon cerveau que je peux enfin me souvenir des choses importantes. Mon beau-frère a été choqué quand je lui ai souhaité son anniversaire pour la première fois en 5 ans !"</p>
                <div className="mt-4 text-yellow-500 text-xl">★★★★★</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white text-black p-6 border-4 border-yellow-300 md:mt-8"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-bold">Thomas L.</p>
                    <p className="text-sm">Ingénieur</p>
                  </div>
                </div>
                <p className="italic">"Ma productivité a tellement augmenté que je termine mes journées à 15h. Mon patron m'a pris à part pour me demander si je prenais des 'substances créatives' - je lui ai juste montré mon journal !"</p>
                <div className="mt-4 text-yellow-500 text-xl">★★★★★</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white text-black p-6 border-4 border-yellow-300 md:mt-16"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-bold">Marion K.</p>
                    <p className="text-sm">Ex-consultante, Entrepreneur</p>
                  </div>
                </div>
                <p className="italic">"Après 21 jours d'écriture honnête, j'ai réalisé à quel point mon travail me rendait malheureuse. J'ai démissionné, lancé ma propre entreprise, et maintenant je consulte depuis une yourte avec une meilleure connexion internet que mon ancien bureau."</p>
                <div className="mt-4 text-yellow-500 text-xl">★★★★★</div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Pricing/CTA */}
        <section className="bg-yellow-300 py-20 relative">

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto px-4 text-center"
          >
            <h2 className="text-5xl font-black mb-6">
              <span className="bg-black text-white px-4 py-2 inline-block transform rotate-1">
                COMMENCE TON DÉFI DE 21 JOURS
              </span>
            </h2>

            <p className="text-2xl mb-8 font-bold">
              Rejoins les milliers de personnes qui ont transformé leur vie grâce à l'écriture quotidienne
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xl font-bold bg-yellow-300 text-black px-8 py-3 rounded-none border-4 border-yellow-300 hover:bg-black hover:text-yellow-300 transition-all"
            >
              COMMENCER MON DÉFI DE 21 JOURS →
            </motion.button>
            <p className="mt-4 opacity-80">
              Gratuit pendant 7 jours. Aucune carte de crédit requise.
            </p>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-10 bg-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="font-bold">© 2025 LexiStep | Tous droits réservés</p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="font-bold hover:underline">Confidentialité</a>
              <a href="#" className="font-bold hover:underline">Conditions</a>
              <a href="#" className="font-bold hover:underline">Contact</a>
              <a href="#" className="font-bold hover:underline">À propos</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}