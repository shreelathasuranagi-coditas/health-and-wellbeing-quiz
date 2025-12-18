import { Injectable, computed, signal } from '@angular/core';

type SectionId = 'general' | 'personal' | 'family';

export interface SectionProgress {
  id: SectionId;
  title: string;
  completed: number;
  total: number;
  progress: number; 
}
       
export interface AnswerEntry {
  section: SectionId;
  question: string;
  answer: string;
}

@Injectable({ providedIn: 'root' })
export class ProgressService {

  
  private sections = signal<SectionProgress[]>([
    { id: 'general', title: 'General Info', completed: 0, total: 0, progress: 0 },
    { id: 'personal', title: 'Personal Info', completed: 0, total: 0, progress: 0 },
    { id: 'family', title: 'Family Info', completed: 0, total: 0, progress: 0 },
  ]);

  selected = signal<SectionId>('general');

  private answers = signal<Record<SectionId, Record<string, AnswerEntry>>>({
    general: {},
    personal: {},
    family: {},
  });

  sectionList = computed(() => this.sections());
  allAnswers = computed(() =>
    Object.values(this.answers()).flatMap(sectionMap => Object.values(sectionMap)),
  );

  sectionAnswers(id: SectionId) {
    return computed(() => Object.values(this.answers()[id] ?? {}));
  }

  setSelected(id: SectionId) {
    this.selected.set(id);
  }

  updateSection(id: SectionId, answered: number, total: number) {
    this.sections.update(prev =>
      prev.map(sec => {
        if (sec.id !== id) return sec;

        const safeTotal = Math.max(total, 0);
        const clampedAnswered = Math.min(Math.max(answered, 0), safeTotal || answered);
        const progress = safeTotal > 0 ? Math.min(100, (clampedAnswered / safeTotal) * 100) : 0;

        return {
          ...sec,
          completed: clampedAnswered,
          total: safeTotal,
          progress,
        };
      }),
    );
  }

  setAnswer(section: SectionId, question: string, answer: string) {
    this.answers.update(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] ?? {}),
        [question]: { section, question, answer },
      },
    }));
  }
}
