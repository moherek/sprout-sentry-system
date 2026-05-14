import { useState } from "react";
import { ChevronRight, ChevronLeft, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { Program, Section, Weekday, Zone } from "@/lib/irrigation/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { calculateTotalDuration, generateSectionId, validateProgram } from "@/lib/irrigation/program-utils";

interface ProgramEditorProps {
  program: Program | null;
  zones: Zone[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (program: Program) => void;
}

type EditorStep = "weekdays" | "times" | "sections" | "options";

const WEEKDAYS: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAY_NAMES: Record<Weekday, string> = {
  Mon: "Poniedziałek",
  Tue: "Wtorek",
  Wed: "Środa",
  Thu: "Czwartek",
  Fri: "Piątek",
  Sat: "Sobota",
  Sun: "Niedziela",
};

const WEEKDAY_SHORT: Record<Weekday, string> = {
  Mon: "Pn",
  Tue: "Wt",
  Wed: "Śr",
  Thu: "Czw",
  Fri: "Pt",
  Sat: "So",
  Sun: "Nd",
};

export function ProgramEditor({ program, zones, open, onOpenChange, onSave }: ProgramEditorProps) {
  const isNew = !program;
  const [step, setStep] = useState<EditorStep>("weekdays");
  const [editingProgram, setEditingProgram] = useState<Partial<Program>>(
    program || {
      id: "",
      name: "Nowy program",
      enabled: true,
      weekdays: [],
      startTimes: [],
      sections: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  );

  const [newStartTime, setNewStartTime] = useState("06:00");
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setStep("weekdays");
    setError(null);
    onOpenChange(false);
  };

  const handleSave = () => {
    const validation = validateProgram(editingProgram);
    if (!validation.valid) {
      setError(validation.errors[0]);
      return;
    }

    onSave(editingProgram as Program);
    handleClose();
  };

  const addStartTime = () => {
    if (!newStartTime || !/^\d{2}:\d{2}$/.test(newStartTime)) {
      setError("Invalid time format (HH:MM)");
      return;
    }

    if (editingProgram.startTimes?.includes(newStartTime)) {
      setError("This time already exists");
      return;
    }

    setEditingProgram((prev) => ({
      ...prev,
      startTimes: [...(prev.startTimes || []), newStartTime].sort(),
    }));

    setNewStartTime("06:00");
    setError(null);
  };

  const removeStartTime = (time: string) => {
    setEditingProgram((prev) => ({
      ...prev,
      startTimes: (prev.startTimes || []).filter((t) => t !== time),
    }));
  };

  const toggleWeekday = (weekday: Weekday) => {
    setEditingProgram((prev) => {
      const current = prev.weekdays || [];
      return {
        ...prev,
        weekdays: current.includes(weekday) ? current.filter((d) => d !== weekday) : [...current, weekday].sort(),
      };
    });
  };

  const addSection = () => {
    const newSection: Section = {
      id: generateSectionId(),
      zoneId: zones[0]?.id || 1,
      durationMin: 20,
      enabled: true,
    };

    setEditingProgram((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }));
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setEditingProgram((prev) => ({
      ...prev,
      sections: (prev.sections || []).map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
    }));
  };

  const removeSection = (sectionId: string) => {
    setEditingProgram((prev) => ({
      ...prev,
      sections: (prev.sections || []).filter((s) => s.id !== sectionId),
    }));
  };

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    const sections = editingProgram.sections || [];
    const index = sections.findIndex((s) => s.id === sectionId);
    if ((direction === "up" && index > 0) || (direction === "down" && index < sections.length - 1)) {
      const newSections = [...sections];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      [newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]];
      setEditingProgram((prev) => ({
        ...prev,
        sections: newSections,
      }));
    }
  };

  const getZoneName = (zoneId: number) => zones.find((z) => z.id === zoneId)?.name || `Zone ${zoneId}`;
  const totalDuration = calculateTotalDuration(editingProgram as Program);
  const enabledSectionsCount = (editingProgram.sections || []).filter((s) => s.enabled).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isNew ? "Nowy program" : `Edycja ${editingProgram.name}`}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step indicator */}
          <div className="flex gap-2 text-xs">
            {(["weekdays", "times", "sections", "options"] as EditorStep[]).map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`px-3 py-1 rounded transition ${
                  step === s ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                {i + 1}. {s === "weekdays" ? "Dni" : s === "times" ? "Godziny" : s === "sections" ? "Sekcje" : "Opcje"}
              </button>
            ))}
          </div>

          {/* Step 1: Weekdays */}
          {step === "weekdays" && (
            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">Wybierz dni wykonania</Label>
                <div className="grid grid-cols-7 gap-2">
                  {WEEKDAYS.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleWeekday(day)}
                      className={`py-2 px-1 rounded text-sm font-medium transition ${
                        (editingProgram.weekdays || []).includes(day)
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10"
                      }`}
                    >
                      {WEEKDAY_SHORT[day]}
                    </button>
                  ))}
                </div>
              </div>

              {editingProgram.weekdays && editingProgram.weekdays.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Wybrane: {editingProgram.weekdays.map((d) => WEEKDAY_NAMES[d]).join(", ")}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Start times */}
          {step === "times" && (
            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">Godziny startu programu</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => {
                      setNewStartTime(e.target.value);
                      setError(null);
                    }}
                    className="flex-1"
                  />
                  <Button onClick={addStartTime} variant="outline" className="px-3">
                    <Plus size={16} />
                  </Button>
                </div>

                {editingProgram.startTimes && editingProgram.startTimes.length > 0 ? (
                  <div className="space-y-2">
                    {editingProgram.startTimes.map((time) => (
                      <div key={time} className="flex items-center justify-between bg-white/5 rounded p-2">
                        <span className="font-medium">{time}</span>
                        <button
                          onClick={() => removeStartTime(time)}
                          className="text-red-400 hover:text-red-300 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Brak godzin. Dodaj przynajmniej jedną.</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Sections */}
          {step === "sections" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Sekcje programu</Label>
                <Button onClick={addSection} variant="outline" size="sm">
                  <Plus size={14} className="mr-1" />
                  Dodaj sekcję
                </Button>
              </div>

              {editingProgram.sections && editingProgram.sections.length > 0 ? (
                <div className="space-y-2">
                  {editingProgram.sections.map((section, idx) => (
                    <div key={section.id} className="bg-white/5 rounded p-3 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">Sekcja {idx + 1}:</span>
                        <select
                          value={section.zoneId}
                          onChange={(e) => updateSection(section.id, { zoneId: Number(e.target.value) })}
                          className="text-sm flex-1 bg-white/10 border border-border rounded px-2 py-1"
                        >
                          {zones.map((zone) => (
                            <option key={zone.id} value={zone.id}>
                              {zone.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">Czas (min)</label>
                          <input
                            type="number"
                            min="1"
                            max="180"
                            value={section.durationMin}
                            onChange={(e) => updateSection(section.id, { durationMin: Math.max(1, Math.min(180, Number(e.target.value))) })}
                            className="w-full bg-white/10 border border-border rounded px-2 py-1 text-sm"
                          />
                        </div>

                        <div className="flex items-end">
                          <label className="flex items-center gap-2 text-sm cursor-pointer flex-1">
                            <Checkbox
                              checked={section.enabled}
                              onCheckedChange={(checked) => updateSection(section.id, { enabled: !!checked })}
                            />
                            <span>Włączona</span>
                          </label>
                        </div>

                        <div className="flex items-end gap-1">
                          <button
                            onClick={() => moveSection(section.id, "up")}
                            disabled={idx === 0}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => moveSection(section.id, "down")}
                            disabled={idx === (editingProgram.sections?.length || 0) - 1}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            onClick={() => removeSection(section.id)}
                            className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Brak sekcji. Dodaj przynajmniej jedną.</p>
              )}

              {enabledSectionsCount > 0 && (
                <div className="text-sm text-muted-foreground bg-white/5 rounded p-2">
                  Włączone sekcje: {enabledSectionsCount} | Całkowity czas: {totalDuration} min
                </div>
              )}
            </div>
          )}

          {/* Step 4: Options */}
          {step === "options" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nazwa programu</label>
                <Input
                  value={editingProgram.name || ""}
                  onChange={(e) => setEditingProgram((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="np. Trawnik"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={editingProgram.enabled ?? true}
                  onCheckedChange={(checked) => setEditingProgram((prev) => ({ ...prev, enabled: !!checked }))}
                />
                <span className="text-sm">Program jest włączony</span>
              </label>

              <div className="bg-white/5 rounded p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dni:</span>
                  <span>{editingProgram.weekdays?.length || 0}/7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Godziny:</span>
                  <span>{editingProgram.startTimes?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sekcje:</span>
                  <span>{enabledSectionsCount} włączonych / {editingProgram.sections?.length || 0} razem</span>
                </div>
                <div className="border-t border-border/50 pt-2 mt-2 flex justify-between font-medium">
                  <span>Łączny czas:</span>
                  <span>{totalDuration} min</span>
                </div>
              </div>
            </div>
          )}

          {error && <div className="text-sm text-red-400 bg-red-500/10 rounded p-2">{error}</div>}
        </div>

        <DialogFooter className="flex gap-2 justify-between">
          <div className="flex gap-2">
            {step !== "weekdays" && (
              <Button
                variant="outline"
                onClick={() => {
                  const steps: EditorStep[] = ["weekdays", "times", "sections", "options"];
                  const currentIdx = steps.indexOf(step);
                  if (currentIdx > 0) setStep(steps[currentIdx - 1]);
                }}
              >
                <ChevronLeft size={16} className="mr-1" />
                Wstecz
              </Button>
            )}

            {step !== "options" && (
              <Button
                onClick={() => {
                  const steps: EditorStep[] = ["weekdays", "times", "sections", "options"];
                  const currentIdx = steps.indexOf(step);
                  if (currentIdx < steps.length - 1) setStep(steps[currentIdx + 1]);
                }}
              >
                Dalej
                <ChevronRight size={16} className="ml-1" />
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Anuluj
            </Button>
            {step === "options" && (
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                Zapisz program
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
