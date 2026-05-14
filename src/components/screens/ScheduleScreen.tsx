import { useState } from "react";
import { Plus } from "lucide-react";
import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import type { Program } from "@/lib/irrigation/types";
import { SchedulePanel } from "../irrigation/SchedulePanel";
import { ProgramCard } from "../irrigation/ProgramCard";
import { ProgramEditor } from "../irrigation/ProgramEditor";
import { Button } from "@/components/ui/button";
import { generateProgramId } from "@/lib/irrigation/program-utils";

interface ScheduleScreenProps {
  hmi: IrrigationController;
}

export function ScheduleScreen({ hmi }: ScheduleScreenProps) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setEditorOpen(true);
  };

  const handleCreateProgram = () => {
    setEditingProgram(null);
    setEditorOpen(true);
  };

  const handleSaveProgram = (program: Program) => {
    if (editingProgram) {
      hmi.updateProgram(editingProgram.id, program);
    } else {
      hmi.addProgram({
        ...program,
        id: generateProgramId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <SchedulePanel hmi={hmi} />

      {/* Programs section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Programy podlewania</h2>
          <Button onClick={handleCreateProgram} className="gap-2">
            <Plus size={18} />
            <span className="hidden sm:inline">Nowy program</span>
          </Button>
        </div>

        {hmi.programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {hmi.programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                zones={hmi.zones}
                onEdit={handleEditProgram}
                hmi={hmi}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl md:rounded-3xl bg-surface border border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground mb-3">Brak programów podlewania</p>
            <Button onClick={handleCreateProgram} variant="outline">
              <Plus size={16} className="mr-2" />
              Stwórz pierwszy program
            </Button>
          </div>
        )}
      </div>

      {/* Program editor */}
      <ProgramEditor
        program={editingProgram}
        zones={hmi.zones}
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSave={handleSaveProgram}
      />
    </div>
  );
}
