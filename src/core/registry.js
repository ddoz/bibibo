// Modular Mini-Game Registry System for Bibibo

class GameRegistry {
  constructor() {
    this.games = new Map();
    this.activeGameId = null;
    this.activeGameInstance = null;
  }

  /**
   * Register a new mini-game module
   * @param {Object} config - Mini-game metadata and lifecycle callbacks
   */
  register(config) {
    if (!config.id || !config.title || typeof config.init !== 'function') {
      throw new Error(`Invalid game module registration: ${config?.id || 'unknown'}`);
    }
    this.games.set(config.id, {
      id: config.id,
      title: config.title,
      description: config.description || '',
      icon: config.icon || '🎮',
      category: config.category || 'Umum',
      badge: config.badge || '',
      color: config.color || '#3A86EF',
      init: config.init,
      destroy: config.destroy || null
    });
  }

  /**
   * Get list of all registered mini-games
   */
  getAllGames() {
    return Array.from(this.games.values());
  }

  /**
   * Get game details by ID
   */
  getGame(id) {
    return this.games.get(id);
  }

  /**
   * Launch a mini-game into the specified container
   */
  async launchGame(id, container, context) {
    if (this.activeGameInstance && typeof this.activeGameInstance.destroy === 'function') {
      try {
        this.activeGameInstance.destroy();
      } catch (e) {
        console.error('Error destroying previous game instance:', e);
      }
    }

    const game = this.games.get(id);
    if (!game) {
      throw new Error(`Game with ID "${id}" not found.`);
    }

    container.innerHTML = ''; // Clear container
    this.activeGameId = id;
    
    // Initialize mini game
    this.activeGameInstance = await game.init(container, context);
    return this.activeGameInstance;
  }

  /**
   * Exit active game and return to hub
   */
  exitCurrentGame() {
    if (this.activeGameInstance && typeof this.activeGameInstance.destroy === 'function') {
      try {
        this.activeGameInstance.destroy();
      } catch (e) {
        console.error('Error destroying game:', e);
      }
    }
    this.activeGameId = null;
    this.activeGameInstance = null;
  }
}

export const registry = new GameRegistry();
