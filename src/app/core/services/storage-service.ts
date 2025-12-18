import { Injectable } from '@angular/core';

export type StoredAnswer = string | number | string[];

/**
 * Thin wrapper around `localStorage` to persist quiz answers.
 *
 * - Answers are stored under a single key: `quiz_answers`
 * - Each entry is keyed by the question text, and optionally tagged with a section id
 * - All methods are null‑safe when `localStorage` is unavailable (e.g. during SSR)
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly STORAGE_KEY = 'quiz_answers';

  private get storageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private readAll(): Record<string, { question: string; answer: StoredAnswer; section?: string }> {
    if (!this.storageAvailable) return {};

    try {
      const raw = window.localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  }

  private writeAll(
    data: Record<string, { question: string; answer: StoredAnswer; section?: string }>,
  ): void {
    if (!this.storageAvailable) return;
    try {
      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {
      // swallow quota / serialization errors – persistence is best‑effort
    }
  }

  /**
   * Save or update a single answer keyed by question text.
   * The optional `section` is just metadata to make later grouping easier.
   */
  saveAnswer(question: string, answer: StoredAnswer, section?: string): void {
    const all = this.readAll();
    all[question] = { question, answer, section };
    this.writeAll(all);
  }

  /** Get the stored answer (if any) for a given question text. */
  getAnswer(question: string): StoredAnswer | null {
    const all = this.readAll();
    return all[question]?.answer ?? null;
  }

  /** Return all stored answers as an array. */
  getAllAnswers(): Array<{ question: string; answer: StoredAnswer; section?: string }> {
    return Object.values(this.readAll());
  }

  /** Remove the stored answer for a single question. */
  clearAnswer(question: string): void {
    const all = this.readAll();
    if (all[question]) {
      delete all[question];
      this.writeAll(all);
    }
  }

  /** Wipe all stored answers from localStorage. */
  clearAll(): void {
    if (!this.storageAvailable) return;
    try {
      window.localStorage.removeItem(this.STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}
