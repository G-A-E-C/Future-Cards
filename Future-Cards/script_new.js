class FutureCardsGame {
    constructor() {
        this.deck = [];
        this.positions = {};
        this.gameInProgress = false;
        this.currentPosition = 'K';
        this.currentMode = 'manual'; // 'manual' o 'auto'
        this.shuffleType = 'perfect';
        this.draggedCard = null;
        
        this.initializeGame();
        this.setupEventListeners();
    }

    /* =====================================================
       INICIALIZACIÓN DEL JUEGO
    ===================================================== */
    initializeGame() {
        this.createDeck();
        this.initializePositions();
    }

    createDeck() {
        const suits = ['C', 'D', 'H', 'S']; // Clubs, Diamonds, Hearts, Spades
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        this.deck = [];
        suits.forEach(suit => {
            values.forEach(value => {
                this.deck.push({
                    suit: suit,
                    value: value,
                    revealed: false,
                    hue: Math.random() * 360 // Para variación visual sutil
                });
            });
        });
    }

    initializePositions() {
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.positions = {};
        
        positionNames.forEach(pos => {
            this.positions[pos] = {
                faceDown: [],
                faceUp: []
            };
        });
    }

    shuffleDeck(type = 'perfect') {
        if (type === 'perfect') {
            this.riffleShuffle();
        } else {
            this.imperfectShuffle();
        }
    }

    riffleShuffle() {
        // Simulación de riffle shuffle (barajado perfecto)
        const mid = Math.floor(this.deck.length / 2);
        const left = this.deck.slice(0, mid);
        const right = this.deck.slice(mid);
        
        this.deck = [];
        let leftIndex = 0, rightIndex = 0;
        
        while (leftIndex < left.length || rightIndex < right.length) {
            // Alternar entre las dos mitades con ligera variación
            if (leftIndex < left.length && (rightIndex >= right.length || Math.random() > 0.5)) {
                this.deck.push(left[leftIndex++]);
            } else if (rightIndex < right.length) {
                this.deck.push(right[rightIndex++]);
            }
        }
    }

    imperfectShuffle() {
        // Fisher-Yates shuffle (mezcla completamente aleatoria)
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCards() {
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        let cardIndex = 0;
        
        // Repartir 4 cartas a cada posición, todas boca abajo inicialmente
        for (let round = 0; round < 4; round++) {
            positionNames.forEach(pos => {
                if (cardIndex < this.deck.length) {
                    const card = this.deck[cardIndex];
                    card.revealed = false;
                    this.positions[pos].faceDown.push(card);
                    cardIndex++;
                }
            });
        }
        
        this.renderBoard();
        this.updateGameInfo();
    }

    showShuffleAnimation() {
        const shuffleOverlay = document.getElementById('shuffle-animation');
        shuffleOverlay.classList.remove('hidden');
        
        // Animar por 3 segundos
        setTimeout(() => {
            shuffleOverlay.classList.add('hidden');
            this.animatedDealCards();
        }, 3000);
    }

    animatedDealCards() {
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        let dealDelay = 0;
        let cardIndex = 0;
        
        // Repartir 4 cartas a cada posición con animación
        for (let round = 0; round < 4; round++) {
            positionNames.forEach(pos => {
                if (cardIndex < this.deck.length) {
                    setTimeout(() => {
                        const card = this.deck[cardIndex];
                        card.revealed = false;
                        this.positions[pos].faceDown.push(card);
                        
                        // Renderizar solo esa posición para el efecto de reparto
                        const faceDownElement = document.querySelector(`[data-position="${pos}"] .face-down-stack`);
                        if (faceDownElement) {
                            const cardElement = this.createCardElement(card, pos, this.positions[pos].faceDown.length - 1, 'faceDown');
                            faceDownElement.appendChild(cardElement);
                        }
                        
                        this.updateGameInfo();
                    }, dealDelay);
                    
                    dealDelay += 100;
                    cardIndex++;
                }
            });
        }
    }

    renderBoard() {
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        positionNames.forEach(pos => {
            const faceDownElement = document.querySelector(`[data-position="${pos}"] .face-down-stack`);
            const faceUpElement = document.querySelector(`[data-position="${pos}"] .face-up-stack`);
            const positionContainer = document.querySelector(`[data-position="${pos}"]`);
            
            // Limpiar pilas
            if (faceDownElement) faceDownElement.innerHTML = '';
            if (faceUpElement) faceUpElement.innerHTML = '';
            
            // Resaltar posición actual durante el juego
            if (this.gameInProgress && pos === this.currentPosition) {
                positionContainer.classList.add('current-position');
            } else {
                positionContainer.classList.remove('current-position');
            }
            
            // Renderizar pila boca abajo
            this.positions[pos].faceDown.forEach((card, index) => {
                const cardElement = this.createCardElement(card, pos, index, 'faceDown');
                if (faceDownElement) faceDownElement.appendChild(cardElement);
            });
            
            // Renderizar pila boca arriba
            this.positions[pos].faceUp.forEach((card, index) => {
                const cardElement = this.createCardElement(card, pos, index, 'faceUp');
                if (faceUpElement) faceUpElement.appendChild(cardElement);
            });
        });
        
        this.updateGameInfo();
    }

    createCardElement(card, position, index, pileType) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.draggable = this.gameInProgress && this.currentMode === 'manual';
        cardElement.dataset.card = `${card.value}-${card.suit}`;
        cardElement.dataset.position = position;
        cardElement.dataset.index = index;
        cardElement.dataset.pileType = pileType;
        
        const img = document.createElement('img');
        
        if (pileType === 'faceDown' || !card.revealed) {
            // Carta boca abajo - mostrar reverso
            img.src = 'img/cards/Backcard.png';
            cardElement.classList.add('face-down');
        } else {
            // Carta boca arriba - mostrar frente
            img.src = `img/cards/${card.value}-${card.suit}.png`;
            cardElement.classList.add('face-up');
        }
        
        img.alt = card.revealed ? `${card.value} of ${card.suit}` : 'Carta boca abajo';
        img.style.filter = `hue-rotate(${card.hue}deg)`;
        cardElement.appendChild(img);
        
        // Manejar eventos de drag para modo manual
        if (this.gameInProgress && this.currentMode === 'manual') {
            cardElement.addEventListener('dragstart', (e) => {
                if (pileType === 'faceUp' && index === this.positions[position].faceUp.length - 1) {
                    this.draggedCard = {
                        card: card,
                        fromPosition: position,
                        fromIndex: index,
                        fromPile: pileType
                    };
                    e.dataTransfer.setData('text/plain', '');
                } else {
                    e.preventDefault();
                }
            });
        }
        
        // Click para voltear cartas en pila boca abajo
        if (pileType === 'faceDown') {
            cardElement.addEventListener('click', () => {
                if (this.gameInProgress && index === this.positions[position].faceDown.length - 1) {
                    this.flipTopCard(position);
                }
            });
        }
        
        return cardElement;
    }

    flipTopCard(position) {
        const faceDownPile = this.positions[position].faceDown;
        const faceUpPile = this.positions[position].faceUp;
        
        if (faceDownPile.length > 0) {
            const card = faceDownPile.pop();
            card.revealed = true;
            faceUpPile.push(card);
            this.renderBoard();
        }
    }

    /* =====================================================
       FASE 3: LÓGICA DEL JUEGO
    ===================================================== */
    startGame() {
        if (this.gameInProgress) return;
        
        this.gameInProgress = true;
        this.currentPosition = 'K';
        
        // Habilitar controles
        document.getElementById('auto-play').disabled = false;
        document.getElementById('start-game').disabled = true;
        
        // Comenzar el proceso desde la posición K
        if (this.currentMode === 'auto') {
            setTimeout(() => {
                this.startAutoPlay();
            }, 1000);
        }
        
        this.renderBoard();
    }

    // Función para obtener la carta superior (prioriza pila boca arriba)
    getTopCard(position) {
        const faceUpPile = this.positions[position].faceUp;
        const faceDownPile = this.positions[position].faceDown;
        
        if (faceUpPile.length > 0) {
            return faceUpPile[faceUpPile.length - 1];
        } else if (faceDownPile.length > 0) {
            return faceDownPile[faceDownPile.length - 1];
        }
        return null;
    }

    // Función para remover la carta superior
    removeTopCard(position) {
        const faceUpPile = this.positions[position].faceUp;
        const faceDownPile = this.positions[position].faceDown;
        
        if (faceUpPile.length > 0) {
            return faceUpPile.pop();
        } else if (faceDownPile.length > 0) {
            return faceDownPile.pop();
        }
        return null;
    }

    // Función para agregar carta a una posición
    addCardToPosition(card, position, faceUp = true) {
        if (faceUp) {
            card.revealed = true;
            this.positions[position].faceUp.push(card);
        } else {
            card.revealed = false;
            this.positions[position].faceDown.push(card);
        }
    }

    // Función simplificada para mover cartas (principalmente para compatibilidad)
    moveCardToDestination(card, fromPosition) {
        const targetPosition = this.getTargetPosition(card.value);
        
        if (targetPosition) {
            // Mover carta de una posición a otra
            const removedCard = this.removeTopCard(fromPosition);
            if (removedCard) {
                this.addCardToPosition(removedCard, targetPosition, true);
                this.currentPosition = targetPosition;
                this.renderBoard();
                return true;
            }
        }
        return false;
    }

    getTargetPosition(cardValue) {
        // Mapeo directo: el valor de la carta determina su posición destino
        return cardValue;
    }

    checkGameEnd() {
        // El juego solo termina cuando una pila se llena completamente con 4 cartas del mismo valor
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        for (let pos of positionNames) {
            const faceUpPile = this.positions[pos].faceUp;
            
            // Verificar si la pila boca arriba tiene 4 cartas del valor correspondiente
            if (faceUpPile.length >= 4) {
                const correctCards = faceUpPile.filter(card => 
                    this.getTargetPosition(card.value) === pos
                ).length;
                
                if (correctCards >= 4) {
                    // Una pila se llenó con 4 cartas del valor correcto
                    if (pos === 'K') {
                        console.log('La pila K se llenó completamente - Juego terminado: NO');
                        this.endGame(false); // NO - K se llenó primero
                    } else {
                        console.log(`La pila ${pos} se llenó completamente - Juego terminado: SÍ`);
                        this.endGame(true); // SÍ - otra pila se llenó
                    }
                    return true;
                }
            }
        }
        
        // Verificar si no hay más cartas boca abajo en la posición actual
        const currentPosition = this.positions[this.currentPosition];
        const hasMoreFaceDownCards = currentPosition.faceDown.length > 0;
        
        if (!hasMoreFaceDownCards) {
            // Buscar otra posición con cartas boca abajo
            let foundAlternative = false;
            for (let pos of positionNames) {
                const position = this.positions[pos];
                if (position.faceDown.length > 0) {
                    this.currentPosition = pos;
                    foundAlternative = true;
                    break;
                }
            }
            
            if (!foundAlternative) {
                console.log('No hay más cartas boca abajo en ninguna posición - Juego terminado: NO');
                this.endGame(false); // NO - no hay más cartas para revelar
                return true;
            }
        }
        
        return false;
    }

    hasUnflippedCards() {
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        for (let pos of positionNames) {
            const position = this.positions[pos];
            if (position.faceDown.length > 0) {
                return true;
            }
        }
        
        return false;
    }

    /* =====================================================
       MODO AUTOMÁTICO
    ===================================================== */
    startAutoPlay() {
        this.autoPlayStep();
    }

    autoPlayStep() {
        if (!this.gameInProgress) return;
        
        // Verificar fin de juego antes de cada paso
        if (this.checkGameEnd()) return;
        
        // Resaltar posición actual
        this.highlightPosition(this.currentPosition);
        
        // Paso 1: Voltear la primera carta boca abajo de la posición actual (si existe)
        const currentPosition = this.positions[this.currentPosition];
        
        if (currentPosition.faceDown.length > 0) {
            // Hay cartas boca abajo, voltear la superior
            this.flipTopCard(this.currentPosition);
            
            setTimeout(() => {
                // Paso 2: Verificar si la carta volteada puede/debe moverse
                const topFaceUpCard = this.getTopCard(this.currentPosition);
                
                if (topFaceUpCard && topFaceUpCard.revealed) {
                    const targetPosition = this.getTargetPosition(topFaceUpCard.value);
                    
                    if (targetPosition && this.canPlaceCardInPosition(targetPosition)) {
                        // Mover carta al destino
                        const removedCard = this.removeTopCard(this.currentPosition);
                        this.addCardToPosition(removedCard, targetPosition, true);
                        
                        // Animar movimiento
                        this.animateCardMovement(removedCard, this.currentPosition, targetPosition);
                        
                        // Cambiar posición actual al destino
                        this.currentPosition = targetPosition;
                        
                        setTimeout(() => {
                            this.renderBoard();
                            setTimeout(() => this.autoPlayStep(), 1500);
                        }, 1200);
                    } else {
                        // No se puede mover, continuar desde la misma posición
                        setTimeout(() => this.autoPlayStep(), 1000);
                    }
                } else {
                    setTimeout(() => this.autoPlayStep(), 1000);
                }
            }, 1000);
        } else {
            // No hay más cartas boca abajo en esta posición
            this.checkGameEnd();
        }
    }

    canPlaceCardInPosition(position) {
        // Permitir colocar cartas siempre, no hay límite estricto de 4
        // El juego termina cuando una pila se llena con 4 cartas del mismo valor
        return true;
    }

    highlightPosition(position) {
        // Remover highlights previos
        document.querySelectorAll('.card-position').forEach(pos => {
            pos.classList.remove('highlight');
        });
        
        // Agregar highlight a posición actual
        const posElement = document.querySelector(`[data-position="${position}"]`);
        if (posElement) {
            posElement.classList.add('highlight');
            
            // Remover highlight después de un tiempo
            setTimeout(() => {
                posElement.classList.remove('highlight');
            }, 2000);
        }
    }

    animateCardMovement(card, fromPosition, toPosition) {
        // Placeholder para animación de movimiento
        console.log(`Animando movimiento de ${card.value}-${card.suit} de ${fromPosition} a ${toPosition}`);
    }

    endGame(result) {
        this.gameInProgress = false;
        
        // Deshabilitar controles
        document.getElementById('auto-play').disabled = true;
        document.getElementById('start-game').disabled = false;
        
        // Mostrar resultado
        const resultElement = document.getElementById('result');
        const answerElement = document.getElementById('answer');
        
        if (answerElement) {
            answerElement.textContent = result ? 'SÍ' : 'NO';
            answerElement.className = result ? 'answer yes' : 'answer no';
        }
        
        // Cambiar a pantalla de resultados
        setTimeout(() => {
            this.showScreen('result-screen');
        }, 2000);
    }

    /* =====================================================
       MODO MANUAL - DRAG & DROP
    ===================================================== */
    setupDropZones() {
        const positions = document.querySelectorAll('.card-position');
        
        positions.forEach(position => {
            position.addEventListener('dragover', (e) => {
                e.preventDefault();
                position.classList.add('drag-over');
            });
            
            position.addEventListener('dragleave', () => {
                position.classList.remove('drag-over');
            });
            
            position.addEventListener('drop', (e) => {
                e.preventDefault();
                position.classList.remove('drag-over');
                
                if (this.draggedCard) {
                    const targetPosition = position.dataset.position;
                    const targetPileType = 'faceUp'; // Siempre se coloca en pila boca arriba
                    
                    if (this.isValidMove(this.draggedCard.card, targetPosition)) {
                        this.performManualMove(this.draggedCard, targetPosition, targetPileType);
                    }
                    
                    this.draggedCard = null;
                }
            });
        });
    }

    isValidMove(card, targetPosition) {
        // Permitir mover cualquier carta a cualquier posición
        return true;
    }

    performManualMove(dragInfo, targetPosition, targetPileType) {
        // Remover carta de la posición origen
        const fromPosition = dragInfo.fromPosition;
        const fromPile = dragInfo.fromPile;
        
        if (fromPile === 'faceUp') {
            this.positions[fromPosition].faceUp.pop();
        } else {
            this.positions[fromPosition].faceDown.pop();
        }
        
        // Agregar carta a la posición destino
        this.addCardToPosition(dragInfo.card, targetPosition, targetPileType === 'faceUp');
        
        // Actualizar posición actual
        this.currentPosition = targetPosition;
        
        // Renderizar y verificar estado del juego
        this.renderBoard();
        this.checkGameEnd();
    }

    /* =====================================================
       UTILIDADES
    ===================================================== */
    updateGameInfo() {
        const modeIndicator = document.getElementById('mode-indicator');
        const cardsRemaining = document.getElementById('cards-remaining');
        
        if (modeIndicator) {
            modeIndicator.textContent = `Modo: ${this.currentMode === 'manual' ? 'Manual' : 'Automático'} | Posición actual: ${this.currentPosition}`;
        }
        
        if (cardsRemaining) {
            const totalUnflipped = Object.values(this.positions)
                .reduce((total, position) => total + position.faceDown.length, 0);
            cardsRemaining.textContent = `Cartas sin revelar: ${totalUnflipped}`;
        }
    }

    resetGame() {
        this.gameInProgress = false;
        this.currentPosition = 'K';
        this.draggedCard = null;
        
        // Limpiar posiciones
        this.initializePositions();
        
        // Resetear deck
        this.createDeck();
        
        // Resetear UI
        document.getElementById('start-game').disabled = false;
        document.getElementById('auto-play').disabled = true;
        
        // Limpiar tablero visual
        this.renderBoard();
        
        // Volver a pantalla de juego
        this.showScreen('game-screen');
    }

    setupEventListeners() {
        // Botón de inicio
        const startBtn = document.getElementById('start-game');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startNewGame());
        }
        
        // Botón de modo automático
        const autoBtn = document.getElementById('auto-play');
        if (autoBtn) {
            autoBtn.addEventListener('click', () => {
                this.currentMode = 'auto';
                this.startAutoPlay();
            });
        }
        
        // Botón de reinicio
        const resetBtn = document.getElementById('reset-game');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
        }
        
        // Botón de home
        const homeBtn = document.getElementById('home-btn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => this.showScreen('home-screen'));
        }
        
        // Botón play
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.showModeModal());
        }
        
        // Modal de selección
        const modalBtns = document.querySelectorAll('.mode-option');
        modalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                const shuffle = document.querySelector('input[name="shuffle"]:checked').value;
                this.selectGameMode(mode, shuffle);
            });
        });
        
        // Configurar drop zones para modo manual
        this.setupDropZones();
    }

    startNewGame() {
        // Obtener configuraciones
        const shuffleType = document.querySelector('input[name="shuffle"]:checked')?.value || 'perfect';
        
        // Barajar y repartir
        this.shuffleDeck(shuffleType);
        this.showShuffleAnimation();
    }

    selectGameMode(mode, shuffleType) {
        this.currentMode = mode;
        this.shuffleType = shuffleType;
        
        // Cerrar modal
        document.getElementById('mode-modal').style.display = 'none';
        
        // Ir a pantalla de juego
        this.showScreen('game-screen');
        
        // Comenzar nuevo juego
        this.startNewGame();
    }

    showModeModal() {
        document.getElementById('mode-modal').style.display = 'flex';
    }

    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.game = new FutureCardsGame();
});
