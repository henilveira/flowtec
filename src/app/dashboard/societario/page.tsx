"use client";

import { useState } from "react";
import { FilterIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanColumn } from "./kanban-column";
import { NewCardDialog } from "./new-card-dialog";
import { EditCardSheet } from "./edit-card-sheet";
import { MoveCardAlert } from "./move-card-alert-dialog";
import { KanbanCard, stages, gradientColors } from "@/@types/Kaban";
import Title from "../page-title";

export default function EnhancedKanbanBoard() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [isNewCardDialogOpen, setIsNewCardDialogOpen] = useState(false);
  const [isEditCardSheetOpen, setIsEditCardSheetOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState<Partial<KanbanCard>>({
    title: "",
    description: "",
    stage: 0,
  });

  const addCard = () => {
    if (newCard.title?.trim()) {
      const cardToAdd: KanbanCard = {
        ...(newCard as KanbanCard),
        id: Date.now().toString(),
        color:
          gradientColors[Math.floor(Math.random() * gradientColors.length)],
        startDate: new Date().toISOString().split("T")[0],
        completedProcesses: [],
      };
      setCards([...cards, cardToAdd]);
      setNewCard({ title: "", description: "", stage: 0 });
      setIsNewCardDialogOpen(false);
    }
  };

  const openEditCardSheet = (card: KanbanCard) => {
    setEditingCard(card);
    setIsEditCardSheetOpen(true);
  };

  const updateCard = () => {
    if (editingCard) {
      const updatedCards = cards.map((card) =>
        card.id === editingCard.id ? editingCard : card
      );
      setCards(updatedCards);
      checkAndMoveCard(editingCard, updatedCards);
      setIsEditCardSheetOpen(false);
      setEditingCard(null);
    }
  };

  const checkAndMoveCard = (card: KanbanCard, updatedCards: KanbanCard[]) => {
    const currentStage = stages[card.stage];
    if (
      currentStage.processes.every((task) => card.completedProcesses.includes(task))
    ) {
      if (card.stage < stages.length - 1) {
        setIsAlertDialogOpen(true);
      } else {
        setCards(updatedCards.filter((c) => c.id !== card.id));
      }
    }
  };

  const moveCardToNextStage = () => {
    if (editingCard) {
      const updatedCard = {
        ...editingCard,
        stage: editingCard.stage + 1,
        completedTasks: [],
      };
      setCards(
        cards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
      );
      setIsAlertDialogOpen(false);
    }
  };

  return (
    <div>
      <Title titulo="Societário">
        <Button variant="outline">
          <FilterIcon className="mr-2 h-4 w-4" /> Filtrar
        </Button>
        <Button variant='flowtec' onClick={() => setIsNewCardDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Processo
          </Button>
      </Title>
      <div className="p-4 bg-gray-100 min-h-screen">
        <div className="mb-4 flex items-center justify-between">
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {stages.map((stage, stageIndex) => (
            <KanbanColumn
              key={stage.name}
              stage={stage}
              stageIndex={stageIndex}
              cards={cards.filter((card) => card.stage === stageIndex)}
              onCardClick={openEditCardSheet}
            />
          ))}
        </div>
        <NewCardDialog
          isOpen={isNewCardDialogOpen}
          onClose={() => setIsNewCardDialogOpen(false)}
          newCard={newCard}
          setNewCard={setNewCard}
          addCard={addCard}
        />
        <EditCardSheet
          isOpen={isEditCardSheetOpen}
          onClose={() => setIsEditCardSheetOpen(false)}
          editingCard={editingCard}
          setEditingCard={setEditingCard}
          updateCard={updateCard}
        />
        <MoveCardAlert
          isOpen={isAlertDialogOpen}
          onClose={() => setIsAlertDialogOpen(false)}
          onMove={moveCardToNextStage}
        />
      </div>
    </div>
  );
}
