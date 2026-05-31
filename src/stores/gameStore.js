import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
  // Screen management
  screen: 'splash', // splash | avatar | cutscene | world | letterforest | minigame | reward | home
  prevScreen: null,

  // Player data
  player: {
    name: '',
    skinTone: '#FFDABB',
    hairColor: '#4A2800',
    hairStyle: 'short',
    clothesColor: '#4A90D9',
    hatStyle: 'none',
    petType: 'cat',
    petName: 'Naranjo',
  },

  // Progress
  coins: 0,
  level: 1,
  xp: 0,
  lettersLearned: [],
  lettersInProgress: [],

  // Current activity
  currentLetter: null,
  minigameType: null,
  lastReward: null,

  // Lumi state
  lumiMessage: '¡Hola! Soy Lumi. ¡Bienvenido a Villa Amparo!',
  lumiAnimation: 'float',

  // Actions
  setScreen: (screen) => set({ prevScreen: get().screen, screen }),

  setPlayer: (updates) => set(state => ({ player: { ...state.player, ...updates } })),

  addCoins: (amount) => set(state => ({ coins: state.coins + amount })),

  addXP: (amount) => set(state => {
    const newXP = state.xp + amount
    const newLevel = Math.floor(Math.sqrt(newXP / 50)) + 1
    return { xp: newXP, level: Math.max(state.level, newLevel) }
  }),

  learnLetter: (letter) => set(state => ({
    lettersLearned: state.lettersLearned.includes(letter)
      ? state.lettersLearned
      : [...state.lettersLearned, letter]
  })),

  setCurrentLetter: (letter) => set({ currentLetter: letter }),

  setMinigameType: (type) => set({ minigameType: type }),

  lumiSay: (message, animation = 'float') => set({ lumiMessage: message, lumiAnimation: animation }),

  setLastReward: (reward) => set({ lastReward: reward }),

  goToMinigame: (letter, type) => set({
    currentLetter: letter,
    minigameType: type,
    screen: 'minigame'
  }),

  completeMinigame: (correct) => {
    const state = get()
    if (correct) {
      set({
        coins: state.coins + 15,
        xp: state.xp + 20,
        lettersLearned: state.lettersLearned.includes(state.currentLetter)
          ? state.lettersLearned
          : [...state.lettersLearned, state.currentLetter],
        lastReward: { coins: 15, xp: 20, letter: state.currentLetter },
        screen: 'reward'
      })
    } else {
      set({ screen: state.prevScreen || 'letterforest' })
    }
  }
}))
