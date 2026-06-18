/**
 * UI Store — 全局 UI 状态管理
 * 管理 Toast、底部 Sheet、确认对话框等 UI 状态
 */
import { create } from 'zustand';
import type { ToastMessage, ConfirmState, SheetState } from '../types';
import { generateId } from '../constants';

interface UIState {
  toast: ToastMessage | null;
  sheet: SheetState;
  confirm: ConfirmState;

  showToast: (message: string, severity?: ToastMessage['severity']) => void;
  hideToast: () => void;

  openSheet: (title: string, content: React.ReactNode) => void;
  closeSheet: () => void;

  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  hideConfirm: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  toast: null,
  sheet: { open: false, title: '', content: null },
  confirm: { open: false, title: '', message: '', onConfirm: null },

  showToast: (message, severity = 'info') => {
    const id = generateId();
    set({ toast: { id, message, severity } });
    // 自动消失
    setTimeout(() => {
      set((state) => (state.toast?.id === id ? { toast: null } : state));
    }, 3000);
  },

  hideToast: () => set({ toast: null }),

  openSheet: (title, content) =>
    set({ sheet: { open: true, title, content } }),

  closeSheet: () =>
    set({ sheet: { open: false, title: '', content: null } }),

  showConfirm: (title, message, onConfirm) =>
    set({ confirm: { open: true, title, message, onConfirm } }),

  hideConfirm: () =>
    set({ confirm: { open: false, title: '', message: '', onConfirm: null } }),
}));
