// Progress and Rewards System for Bibibo

const STORAGE_KEY = 'bibibo_player_progress';

class ProgressManager {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load progress from localStorage:', e);
    }
    return {
      totalStars: 0,
      gamesPlayed: 0,
      completedLevels: {},
      unlockedBadges: ['pembelajar_pemula']
    };
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  }

  getStars() {
    return this.data.totalStars;
  }

  addStars(amount) {
    this.data.totalStars += amount;
    this.saveData();
    return this.data.totalStars;
  }

  recordLevelCompletion(gameId, levelId, starsEarned = 3) {
    if (!this.data.completedLevels[gameId]) {
      this.data.completedLevels[gameId] = {};
    }
    const currentHigh = this.data.completedLevels[gameId][levelId] || 0;
    if (starsEarned > currentHigh) {
      const diff = starsEarned - currentHigh;
      this.data.completedLevels[gameId][levelId] = starsEarned;
      this.addStars(diff);
    }
    this.data.gamesPlayed++;
    this.saveData();
  }

  getLevelStars(gameId, levelId) {
    return this.data.completedLevels[gameId]?.[levelId] || 0;
  }
}

export const progress = new ProgressManager();
