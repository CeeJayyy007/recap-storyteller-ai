import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DateState {
  selectedDate: Date;
  currentMonth: Date;
  setSelectedDate: (date: Date) => void;
  setCurrentMonth: (date: Date) => void;
  goToToday: () => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
}

export const useDateStore = create<DateState>()(
  persist(
    (set, get) => ({
      selectedDate: new Date(),
      currentMonth: new Date(),
      
      setSelectedDate: (date: Date) => {
        set({ selectedDate: date, currentMonth: new Date(date.getFullYear(), date.getMonth()) });
      },
      
      setCurrentMonth: (date: Date) => {
        set({ currentMonth: date });
      },
      
      goToToday: () => {
        const today = new Date();
        set({ 
          selectedDate: today, 
          currentMonth: new Date(today.getFullYear(), today.getMonth()) 
        });
      },
      
      goToPreviousMonth: () => {
        const { currentMonth } = get();
        const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
        set({ currentMonth: prevMonth });
      },
      
      goToNextMonth: () => {
        const { currentMonth } = get();
        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
        set({ currentMonth: nextMonth });
      },
      
      goToPreviousDay: () => {
        const { selectedDate } = get();
        const prevDay = new Date(selectedDate);
        prevDay.setDate(prevDay.getDate() - 1);
        set({ 
          selectedDate: prevDay,
          currentMonth: new Date(prevDay.getFullYear(), prevDay.getMonth())
        });
      },
      
      goToNextDay: () => {
        const { selectedDate } = get();
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        set({ 
          selectedDate: nextDay,
          currentMonth: new Date(nextDay.getFullYear(), nextDay.getMonth())
        });
      },
    }),
    {
      name: 'date-storage',
      partialize: (state) => ({ 
        selectedDate: state.selectedDate.toISOString(),
        currentMonth: state.currentMonth.toISOString()
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert string dates back to Date objects
          if (typeof state.selectedDate === 'string') {
            state.selectedDate = new Date(state.selectedDate);
          }
          if (typeof state.currentMonth === 'string') {
            state.currentMonth = new Date(state.currentMonth);
          }
        }
      },
    }
  )
); 