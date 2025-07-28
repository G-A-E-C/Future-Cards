/* =====================================================
   FUTURE CARDS - LÓGICA PRINCIPAL MEJORADA
   Juego de Cartas Narrativo con Lógica de Destino
===================================================== */

class FutureCardsGame {
    constructor() {
        this.gameMode = 'manual';
        this.shuffleType = 'perfect';
        this.deck = [];
        this.positions = {};
        this.currentPosition = 'K';
        this.gameInProgress = false;
        this.autoPlayInterval = null;
        
        // Sistema de turnos mejorado
        this.turnState = {
            hasFlippedCard: false,
            lastFlippedPosition: null,
            canFlipCard: true
        };
        
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
        const suits = ['C', 'D', 'H', 'S'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        this.deck = [];
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({
                    value: value,
                    suit: suit,
                    filename: `${value}-${suit}.png`,
                    faceUp: false
                });
            }
        }
    }

    initializePositions() {
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.positions = {};
        
        positionNames.forEach(pos => {
            this.positions[pos] = [];
        });
    }

    /* =====================================================
       SISTEMA DE BARAJADO CON ANIMACIÓN
    ===================================================== */
    async shuffleDeck(type = 'perfect') {
        // Mostrar animación de barajado
        await this.showShuffleAnimation();
        
        if (type === 'perfect') {
            this.riffleShuffle();
        } else {
            this.imperfectShuffle();
        }
    }

    async showShuffleAnimation() {
        return new Promise(resolve => {
            const gameControls = document.querySelector('.game-controls');
            gameControls.innerHTML = `
                <div class="shuffle-animation">
                    <div class="shuffle-message">Barajando cartas...</div>
                    <div class="cards-shuffling">
                        ${Array(8).fill().map((_, i) => 
                            `<div class="shuffle-card" style="animation-delay: ${i * 0.1}s"></div>`
                        ).join('')}
                    </div>
                </div>
            `;
            
            setTimeout(() => {
                this.restoreGameControls();
                resolve();
            }, 2000);
        });
    }

    restoreGameControls() {
        const gameControls = document.querySelector('.game-controls');
        gameControls.innerHTML = `
            <button id="start-game" class="control-button">Iniciar Juego</button>
            <button id="auto-play" class="control-button" disabled>Jugar Automático</button>
            <button id="reset-game" class="control-button">Reiniciar</button>
        `;
        this.setupGameControlListeners();
    }

    riffleShuffle() {
        // Barajado perfecto (riffle shuffle)
        const mid = Math.floor(this.deck.length / 2);
        const left = this.deck.slice(0, mid);
        const right = this.deck.slice(mid);
        
        this.deck = [];
        let i = 0, j = 0;
        
        while (i < left.length && j < right.length) {
            if (Math.random() < 0.5) {
                this.deck.push(left[i++]);
            } else {
                this.deck.push(right[j++]);
            }
        }
        
        // Agregar cartas restantes
        while (i < left.length) this.deck.push(left[i++]);
        while (j < right.length) this.deck.push(right[j++]);
    }

    imperfectShuffle() {
        // Barajado imperfecto (corte en dos pilas y mezcla aleatoria)
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    async dealCards() {
        // Mostrar animación de reparto para TODAS las posiciones
        await this.showDealingAnimation();
        
        // Repartir 4 cartas a cada posición
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        let cardIndex = 0;
        
        // Asegurar que todas las posiciones reciban sus cartas
        for (let round = 0; round < 4; round++) {
            for (let pos of positionNames) {
                if (cardIndex < this.deck.length) {
                    this.positions[pos].push(this.deck[cardIndex]);
                    cardIndex++;
                }
            }
        }
        
        this.renderBoard();
    }

    async showDealingAnimation() {
        return new Promise(resolve => {
            const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
            let dealIndex = 0;
            
            const dealCard = () => {
                if (dealIndex >= 52) {
                    resolve();
                    return;
                }
                
                const position = positionNames[dealIndex % 13];
                const positionElement = document.querySelector(`[data-position="${position}"]`);
                
                if (positionElement) {
                    // Crear carta voladora
                    const flyingCard = document.createElement('div');
                    flyingCard.className = 'flying-card';
                    flyingCard.style.backgroundImage = "url('img/cards/Backcard.png')";
                    
                    // Posición inicial (centro del tablero)
                    const boardContainer = document.querySelector('.board-container');
                    const boardRect = boardContainer.getBoundingClientRect();
                    const targetRect = positionElement.getBoundingClientRect();
                    
                    flyingCard.style.position = 'fixed';
                    flyingCard.style.left = `${boardRect.left + boardRect.width / 2}px`;
                    flyingCard.style.top = `${boardRect.top + boardRect.height / 2}px`;
                    flyingCard.style.width = '75px';
                    flyingCard.style.height = '105px';
                    flyingCard.style.zIndex = '1000';
                    flyingCard.style.transition = 'all 0.3s ease-out';
                    flyingCard.style.backgroundSize = 'cover';
                    flyingCard.style.borderRadius = '8px';
                    flyingCard.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                    
                    document.body.appendChild(flyingCard);
                    
                    // Animar hacia la posición destino
                    setTimeout(() => {
                        flyingCard.style.left = `${targetRect.left + targetRect.width / 2 - 37.5}px`;
                        flyingCard.style.top = `${targetRect.top + targetRect.height / 2 - 52.5}px`;
                        flyingCard.style.transform = 'scale(0.8)';
                    }, 50);
                    
                    // Remover carta voladora
                    setTimeout(() => {
                        flyingCard.remove();
                        dealIndex++;
                        dealCard();
                    }, 350);
                } else {
                    dealIndex++;
                    dealCard();
                }
            };
            
            dealCard();
        });
    }

    /* =====================================================
       RENDERIZADO DEL TABLERO MEJORADO
    ===================================================== */
    renderBoard() {
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        positionNames.forEach(pos => {
            const positionElement = document.querySelector(`[data-position="${pos}"] .card-stack`);
            positionElement.innerHTML = '';
            
            this.positions[pos].forEach((card, index) => {
                const cardElement = this.createCardElement(card, pos, index);
                positionElement.appendChild(cardElement);
            });
            
            // Agregar contador de cartas
            this.updateCardCounter(pos);
        });
        
        this.updateGameInfo();
    }

    createCardElement(card, position, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.value = card.value;
        cardElement.dataset.suit = card.suit;
        cardElement.dataset.position = position;
        cardElement.dataset.index = index;
        
        if (card.faceUp) {
            cardElement.classList.add('face-up');
            const img = document.createElement('img');
            img.src = `img/cards/${card.filename}`;
            img.alt = `${card.value} of ${card.suit}`;
            cardElement.appendChild(img);
            
            if (this.gameMode === 'manual') {
                cardElement.draggable = true;
                this.setupCardDragEvents(cardElement);
            }
        } else {
            cardElement.classList.add('face-down');
            cardElement.style.backgroundImage = "url('img/cards/Backcard.png')";
            cardElement.style.backgroundSize = 'cover';
            cardElement.style.backgroundPosition = 'center';
            
            // Hacer clickeable solo la carta superior
            if (index === this.positions[position].length - 1) {
                cardElement.style.cursor = 'pointer';
                cardElement.addEventListener('click', () => {
                    this.handleCardClick(position);
                });
            }
        }
        
        // Posicionamiento en pila con efecto de apilado
        cardElement.style.position = 'absolute';
        cardElement.style.zIndex = index + 1;
        
        // Efecto de apilamiento realista
        const offsetX = index * 2;
        const offsetY = index * -1.5;
        cardElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        
        // Posición base centrada
        cardElement.style.left = '50%';
        cardElement.style.top = '50%';
        cardElement.style.marginLeft = '-37.5px';
        cardElement.style.marginTop = '-52.5px';
        
        return cardElement;
    }

    updateCardCounter(position) {
        const positionElement = document.querySelector(`[data-position="${position}"]`);
        const existingCounter = positionElement.querySelector('.card-counter');
        
        if (existingCounter) {
            existingCounter.remove();
        }
        
        const faceDownCount = this.positions[position].filter(card => !card.faceUp).length;
        
        if (faceDownCount > 0) {
            const counter = document.createElement('div');
            counter.className = 'card-counter';
            counter.textContent = faceDownCount;
            positionElement.appendChild(counter);
        }
    }

    /* =====================================================
       MANEJO DE CLICS EN CARTAS - SISTEMA DE TURNOS
    ===================================================== */
    handleCardClick(position) {
        if (!this.gameInProgress || !this.turnState.canFlipCard) {
            return;
        }
        
        // Si ya volteó una carta en este turno
        if (this.turnState.hasFlippedCard) {
            // Solo puede voltear otra si la anterior pertenecía a la misma pila
            if (this.turnState.lastFlippedPosition !== position) {
                console.log('No puedes voltear otra carta en este turno');
                return;
            }
        }
        
        const flippedCard = this.flipTopCard(position);
        
        if (flippedCard) {
            this.turnState.hasFlippedCard = true;
            this.turnState.lastFlippedPosition = position;
            this.turnState.canFlipCard = false;
            
            // Verificar si la carta pertenece a esta pila
            const targetPosition = this.getTargetPosition(flippedCard.value);
            
            if (targetPosition === position) {
                // La carta pertenece a esta pila, puede continuar volteando
                setTimeout(() => {
                    this.turnState.canFlipCard = true;
                }, 300);
            } else {
                // La carta no pertenece, debe ser movida manualmente
                console.log('Mueve la carta manualmente a su posición correcta');
            }
        }
    }

    // Resetear turno después de mover una carta
    resetTurn() {
        this.turnState.hasFlippedCard = false;
        this.turnState.lastFlippedPosition = null;
        this.turnState.canFlipCard = true;
    }

    /* =====================================================
       LÓGICA DEL JUEGO MEJORADA
    ===================================================== */
    startGame() {
        if (this.gameInProgress) return;
        
        this.gameInProgress = true;
        this.currentPosition = 'K';
        this.resetTurn();
        
        // Habilitar controles
        document.getElementById('auto-play').disabled = false;
        document.getElementById('start-game').disabled = true;
        
        // NO voltear automáticamente la primera carta
        // El jugador debe hacer clic para voltear cartas
        
        if (this.gameMode === 'auto') {
            this.startAutoPlay();
        }
    }

    flipTopCard(position) {
        const pile = this.positions[position];
        if (pile.length === 0) return null;
        
        // Buscar la primera carta boca abajo desde arriba
        for (let i = pile.length - 1; i >= 0; i--) {
            if (!pile[i].faceUp) {
                pile[i].faceUp = true;
                
                // Animar volteo
                const cardElement = document.querySelector(
                    `[data-position="${position}"] .card[data-index="${i}"]`
                );
                if (cardElement) {
                    cardElement.classList.add('flipping');
                    setTimeout(() => {
                        this.renderBoard();
                        cardElement.classList.remove('flipping');
                    }, 300);
                }
                
                return pile[i];
            }
        }
        return null;
    }

    // ELIMINADA la función moveCardToDestination automática
    // Ahora solo se mueve con drag & drop manual

    manualMoveCard(card, fromPosition, toPosition) {
        // Validar que la carta pertenece a la posición destino
        if (this.getTargetPosition(card.value) !== toPosition) {
            return false;
        }
        
        // Remover carta de la posición actual
        const fromPile = this.positions[fromPosition];
        const cardIndex = fromPile.findIndex(c => 
            c.value === card.value && c.suit === card.suit && c.faceUp
        );
        
        if (cardIndex !== -1) {
            const [movedCard] = fromPile.splice(cardIndex, 1);
            
            // Agregar carta al final de la pila destino
            this.positions[toPosition].push(movedCard);
            
            // Resetear turno después del movimiento
            this.resetTurn();
            
            // Actualizar renderizado
            this.renderBoard();
            
            // Verificar fin de juego
            this.checkGameEnd();
            
            return true;
        }
        
        return false;
    }

    getTargetPosition(cardValue) {
        // Mapeo de valores de cartas a posiciones
        const mapping = {
            'A': 'A', '2': '2', '3': '3', '4': '4', '5': '5',
            '6': '6', '7': '7', '8': '8', '9': '9', '10': '10',
            'J': 'J', 'Q': 'Q', 'K': 'K'
        };
        
        return mapping[cardValue];
    }

    checkGameEnd() {
        // Verificar si quedan cartas boca abajo
        const hasUnflippedCards = this.hasUnflippedCards();
        
        // Verificar si todas las cartas están en sus posiciones correctas
        const allCardsInCorrectPosition = this.areAllCardsInCorrectPositions();
        
        if (!hasUnflippedCards && allCardsInCorrectPosition) {
            // Todas las cartas volteadas y en posición correcta = SÍ
            this.endGame(true);
            return true;
        } else if (!hasUnflippedCards && !allCardsInCorrectPosition) {
            // Todas las cartas volteadas pero no todas en posición correcta = NO
            this.endGame(false);
            return true;
        } else if (this.isGameStuck()) {
            // Game Over por no poder continuar
            this.endGame(false);
            return true;
        }
        
        return false;
    }

    hasUnflippedCards() {
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        for (let pos of positionNames) {
            const pile = this.positions[pos];
            for (let card of pile) {
                if (!card.faceUp) {
                    return true;
                }
            }
        }
        
        return false;
    }

    areAllCardsInCorrectPositions() {
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        for (let pos of positionNames) {
            const pile = this.positions[pos];
            for (let card of pile) {
                if (this.getTargetPosition(card.value) !== pos) {
                    return false;
                }
            }
        }
        
        return true;
    }

    isGameStuck() {
        // Verificar si el juego está atascado (no se puede continuar)
        // Por ejemplo, si no hay más cartas que voltear y quedan cartas mal posicionadas
        return false; // Implementar lógica más compleja si es necesario
    }

    /* =====================================================
       MODO MANUAL - DRAG & DROP MEJORADO
    ===================================================== */
    setupCardDragEvents(cardElement) {
        cardElement.addEventListener('dragstart', (e) => {
            if (!cardElement.classList.contains('face-up')) {
                e.preventDefault();
                return;
            }
            
            cardElement.classList.add('dragging');
            e.dataTransfer.setData('text/plain', JSON.stringify({
                value: cardElement.dataset.value,
                suit: cardElement.dataset.suit,
                position: cardElement.dataset.position
            }));
        });
        
        cardElement.addEventListener('dragend', () => {
            cardElement.classList.remove('dragging');
        });
    }

    setupDropZones() {
        const positions = document.querySelectorAll('.card-position');
        
        positions.forEach(position => {
            position.addEventListener('dragover', (e) => {
                e.preventDefault();
                
                // Solo iluminar si es una zona válida
                const draggedData = e.dataTransfer.types.includes('text/plain');
                if (draggedData) {
                    position.classList.add('highlight');
                }
            });
            
            position.addEventListener('dragleave', () => {
                position.classList.remove('highlight');
            });
            
            position.addEventListener('drop', (e) => {
                e.preventDefault();
                position.classList.remove('highlight');
                
                try {
                    const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
                    const targetPosition = position.dataset.position;
                    
                    const card = {
                        value: cardData.value,
                        suit: cardData.suit,
                        faceUp: true
                    };
                    
                    // Usar la nueva función de movimiento manual
                    const success = this.manualMoveCard(card, cardData.position, targetPosition);
                    
                    if (success) {
                        // Mostrar feedback positivo
                        position.classList.add('success-feedback');
                        setTimeout(() => {
                            position.classList.remove('success-feedback');
                        }, 600);
                    } else {
                        // Mostrar feedback negativo
                        position.classList.add('error-feedback');
                        setTimeout(() => {
                            position.classList.remove('error-feedback');
                        }, 600);
                    }
                } catch (error) {
                    console.error('Error al procesar drop:', error);
                }
            });
        });
    }

    /* =====================================================
       MODO AUTOMÁTICO MEJORADO
    ===================================================== */
    startAutoPlay() {
        // Voltear primera carta de K si no se ha hecho
        const kPile = this.positions['K'];
        const hasFlippedInK = kPile.some(card => card.faceUp);
        
        if (!hasFlippedInK) {
            this.flipTopCard('K');
            setTimeout(() => this.autoPlayStep(), 1000);
        } else {
            this.autoPlayStep();
        }
    }

    autoPlayStep() {
        if (!this.gameInProgress) return;
        
        // Verificar fin de juego
        if (this.checkGameEnd()) return;
        
        // Encontrar la carta boca arriba más reciente en la posición actual
        const currentPile = this.positions[this.currentPosition];
        let topFaceUpCard = null;
        
        for (let i = currentPile.length - 1; i >= 0; i--) {
            if (currentPile[i].faceUp) {
                topFaceUpCard = currentPile[i];
                break;
            }
        }
        
        if (topFaceUpCard) {
            // Mover carta a su destino automáticamente
            const targetPosition = this.getTargetPosition(topFaceUpCard.value);
            this.manualMoveCard(topFaceUpCard, this.currentPosition, targetPosition);
            this.currentPosition = targetPosition;
            
            // Continuar con siguiente carta
            setTimeout(() => this.autoPlayStep(), 1000);
        } else {
            // No hay más cartas boca arriba, voltear siguiente
            const flippedCard = this.flipTopCard(this.currentPosition);
            if (flippedCard) {
                setTimeout(() => this.autoPlayStep(), 1000);
            } else {
                // No hay más cartas en esta posición
                this.checkGameEnd();
            }
        }
    }

    /* =====================================================
       FINALIZACIÓN DEL JUEGO
    ===================================================== */
    endGame(success) {
        this.gameInProgress = false;
        
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        
        // Mostrar pantalla de resultados
        setTimeout(() => {
            this.showResultScreen(success);
        }, 1000);
    }

    showResultScreen(success) {
        const resultScreen = document.getElementById('result-screen');
        const resultAnswer = document.getElementById('result-answer');
        const resultDescription = document.getElementById('result-description');
        
        if (success) {
            resultAnswer.textContent = 'SÍ';
            resultAnswer.className = 'result-answer yes';
            resultDescription.textContent = '¡El destino ha hablado! Todas las cartas encontraron su lugar y las predicciones se han cumplido.';
        } else {
            resultAnswer.textContent = 'GAME OVER';
            resultAnswer.className = 'result-answer no';
            resultDescription.textContent = 'El destino se resiste. Quedan cartas sin revelar y el futuro permanece incierto.';
        }
        
        this.showScreen('result-screen');
    }

    /* =====================================================
       GESTIÓN DE PANTALLAS
    ===================================================== */
    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    /* =====================================================
       UTILIDADES
    ===================================================== */
    updateGameInfo() {
        const modeIndicator = document.getElementById('mode-indicator');
        const cardsRemaining = document.getElementById('cards-remaining');
        
        if (modeIndicator) {
            modeIndicator.textContent = `Modo: ${this.gameMode === 'manual' ? 'Manual' : 'Automático'}`;
        }
        
        if (cardsRemaining) {
            const totalUnflipped = Object.values(this.positions)
                .flat()
                .filter(card => !card.faceUp).length;
            cardsRemaining.textContent = `Cartas sin voltear: ${totalUnflipped}`;
        }
    }

    async resetGame() {
        this.gameInProgress = false;
        this.currentPosition = 'K';
        this.resetTurn();
        
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        
        // Resetear todas las cartas
        this.deck.forEach(card => {
            card.faceUp = false;
        });
        
        // Limpiar posiciones
        this.initializePositions();
        
        // Barajar y repartir nuevamente con animaciones
        await this.shuffleDeck(this.shuffleType);
        await this.dealCards();
        
        // Restaurar controles
        document.getElementById('start-game').disabled = false;
        document.getElementById('auto-play').disabled = true;
    }

    /* =====================================================
       EVENT LISTENERS MEJORADOS
    ===================================================== */
    setupEventListeners() {
        // Botones del menú principal
        document.getElementById('play-btn').addEventListener('click', () => {
            document.getElementById('mode-selection').classList.remove('hidden');
        });
        
        document.getElementById('settings-btn').addEventListener('click', () => {
            alert('Configuraciones próximamente...');
        });
        
        document.getElementById('exit-btn').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres salir?')) {
                window.close();
            }
        });
        
        // Modal de selección de modo
        document.getElementById('manual-mode').addEventListener('click', () => {
            this.gameMode = 'manual';
            this.startNewGame();
        });
        
        document.getElementById('auto-mode').addEventListener('click', () => {
            this.gameMode = 'auto';
            this.startNewGame();
        });
        
        // Controles del juego
        document.getElementById('home-btn').addEventListener('click', () => {
            this.showScreen('home-screen');
            this.resetGame();
        });
        
        this.setupGameControlListeners();
        
        // Botones de pantalla de resultados
        document.getElementById('play-again').addEventListener('click', () => {
            this.showScreen('game-screen');
            this.resetGame();
        });
        
        document.getElementById('return-home').addEventListener('click', () => {
            this.showScreen('home-screen');
            this.resetGame();
        });
    }

    setupGameControlListeners() {
        const startBtn = document.getElementById('start-game');
        const autoBtn = document.getElementById('auto-play');
        const resetBtn = document.getElementById('reset-game');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startGame();
            });
        }
        
        if (autoBtn) {
            autoBtn.addEventListener('click', () => {
                if (this.gameMode === 'manual') {
                    this.gameMode = 'auto';
                    this.startAutoPlay();
                }
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetGame();
            });
        }
    }

    async startNewGame() {
        // Obtener tipo de barajado seleccionado
        const shuffleType = document.querySelector('input[name="shuffle"]:checked').value;
        this.shuffleType = shuffleType;
        
        // Ocultar modal y mostrar juego
        document.getElementById('mode-selection').classList.add('hidden');
        this.showScreen('game-screen');
        
        // Preparar juego con animaciones
        await this.resetGame();
        this.setupDropZones();
    }
}

/* =====================================================
   INICIALIZACIÓN
===================================================== */
document.addEventListener('DOMContentLoaded', () => {
    new FutureCardsGame();
});

    /* =====================================================
       GESTIÓN DE PANTALLAS
    ===================================================== */
    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    /* =====================================================
       UTILIDADES
    ===================================================== */
    updateGameInfo() {
        const modeIndicator = document.getElementById('mode-indicator');
        const cardsRemaining = document.getElementById('cards-remaining');
        
        if (modeIndicator) {
            modeIndicator.textContent = `Modo: ${this.gameMode === 'manual' ? 'Manual' : 'Automático'}`;
        }
        
        if (cardsRemaining) {
            const totalUnflipped = Object.values(this.positions)
                .flat()
                .filter(card => !card.faceUp).length;
            cardsRemaining.textContent = `Cartas sin voltear: ${totalUnflipped}`;
        }
    }

    resetGame() {
        this.gameInProgress = false;
        this.currentPosition = 'K';
        
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        
        // Resetear todas las cartas
        this.deck.forEach(card => {
            card.faceUp = false;
        });
        
        // Limpiar posiciones
        this.initializePositions();
        
        // Barajar y repartir nuevamente
        this.shuffleDeck(this.shuffleType);
        this.dealCards();
        
        // Restaurar controles
        document.getElementById('start-game').disabled = false;
        document.getElementById('auto-play').disabled = true;
    }

    /* =====================================================
       EVENT LISTENERS
    ===================================================== */
    setupEventListeners() {
        // Botones del menú principal
        document.getElementById('play-btn').addEventListener('click', () => {
            document.getElementById('mode-selection').classList.remove('hidden');
        });
        
        document.getElementById('settings-btn').addEventListener('click', () => {
            alert('Configuraciones próximamente...');
        });
        
        document.getElementById('exit-btn').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres salir?')) {
                window.close();
            }
        });
        
        // Modal de selección de modo
        document.getElementById('manual-mode').addEventListener('click', () => {
            this.gameMode = 'manual';
            this.startNewGame();
        });
        
        document.getElementById('auto-mode').addEventListener('click', () => {
            this.gameMode = 'auto';
            this.startNewGame();
        });
        
        // Controles del juego
        document.getElementById('home-btn').addEventListener('click', () => {
            this.showScreen('home-screen');
            this.resetGame();
        });
        
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('auto-play').addEventListener('click', () => {
            if (this.gameMode === 'manual') {
                this.gameMode = 'auto';
                this.startAutoPlay();
            }
        });
        
        document.getElementById('reset-game').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Botones de pantalla de resultados
        document.getElementById('play-again').addEventListener('click', () => {
            this.showScreen('game-screen');
            this.resetGame();
        });
        
        document.getElementById('return-home').addEventListener('click', () => {
            this.showScreen('home-screen');
            this.resetGame();
        });
    }

    startNewGame() {
        // Obtener tipo de barajado seleccionado
        const shuffleType = document.querySelector('input[name="shuffle"]:checked').value;
        this.shuffleType = shuffleType;
        
        // Ocultar modal y mostrar juego
        document.getElementById('mode-selection').classList.add('hidden');
        this.showScreen('game-screen');
        
        // Preparar juego
        this.resetGame();
        this.setupDropZones();
    }
}

/* =====================================================
   INICIALIZACIÓN
===================================================== */
document.addEventListener('DOMContentLoaded', () => {
    new FutureCardsGame();
});
