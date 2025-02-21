// /app/dashboard/game/free-write/page.tsx
"use client";

import WritingGameTemplate from "../../../components/templates/WritingGameTemplate";

export default function FreeWriteGame() {
  // Configuration spécifique pour le mode d'écriture libre
  const gameConfig = {
    title: "MODE ZEN",
    subtitle: "Libère ton cerveau sans limites!",
    exerciseType: "FREEWRITE",
    placeholderText: "Lâche tout ce que ton cerveau invente ici...",
    dailyWordGoalDefault: 200,
    minWordsToSave: 200,
    saveButtonText: "SAUVEGARDER TON CHEF-D'ŒUVRE 🎉",
    entriesListTitle: "PRÉCÉDENTES CRÉATIONS",
    emptyEntriesText: "C'est le moment parfait pour libérer ton génie créatif!",
    successToastText: "👏 MAGNIFIQUE! Ta création est sauvegardée.",
    getProgressMessage: (current: number, goal: number) => {
      return current >= goal
        ? "👑 Tu es roi/reine de l'écriture!"
        : `Encore ${goal - current} mots pour ton chef-d'œuvre`;
    }
  };

  return <WritingGameTemplate config={gameConfig} />;
}