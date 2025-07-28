/*
 * =====================================================
 * 🃏 FUTURE CARDS - JUEGO DE CARTAS INTERACTIVO
 * =====================================================
 * 
 * DESCRIPCIÓN:
 * Juego de cartas estratégico donde el objetivo es organizar
 * todas las cartas de una baraja estándar (52 cartas) en sus
 * posiciones correctas siguiendo reglas específicas de turnos.
 * 
 * MECÁNICAS PRINCIPALES:
 * - Sistema de turnos secuencial (inicia en posición K)
 * - Distribución: 4 cartas por posición (A-K), todas boca abajo
 * - Colocación: Las cartas solo pueden ir a su posición correcta
 * - Victoria: Todas las cartas organizadas en sus posiciones
 * 
 * AUTOR: Gabriel Alejandro Espinoza Coronel (G-A-E-C)
 * FECHA: Julio 2025
 * VERSIÓN: 2.0
 * REPOSITORIO: https://github.com/G-A-E-C/Future-Cards
 * 
 * =====================================================
 */

/**
 * =====================================================
 * 🎮 CLASE PRINCIPAL: FutureCardsGame
 * =====================================================
 * 
 * Esta es la clase principal que maneja toda la lógica del juego.
 * Controla el estado del juego, la distribución de cartas, los turnos,
 * la interfaz de usuario, el modo automático y las validaciones.
 * 
 * FUNCIONALIDADES PRINCIPALES:
 * ✅ Gestión completa del estado del juego
 * ✅ Sistema de turnos secuencial
 * ✅ Validación de movimientos
 * ✅ Modo automático con IA
 * ✅ Interfaz drag & drop
 * ✅ Animaciones y efectos visuales
 * ✅ Sistema de mensajes y feedback
 * =====================================================
 */
class FutureCardsGame {
    
    /**
     * =====================================================
     * 🔧 CONSTRUCTOR - Inicialización del Juego
     * =====================================================
     * 
     * Inicializa todas las variables de estado del juego y configura
     * la estructura básica necesaria para el funcionamiento.
     * 
     * VARIABLES DE ESTADO:
     * - deck: Array con las 52 cartas de la baraja
     * - positions: Objeto con las 13 posiciones (A-K)
     * - gameInProgress: Boolean que indica si hay juego activo
     * - currentPosition: Posición actual del turno
     * - turnState: Estado detallado del turno actual
     * 
     * FLUJO DE INICIALIZACIÓN:
     * 1. Configurar variables de estado
     * 2. Inicializar estructuras de datos
     * 3. Configurar event listeners
     * =====================================================
     */
    constructor() {
        // 📦 ESTRUCTURAS DE DATOS PRINCIPALES
        this.deck = [];                     // Array con todas las cartas de la baraja
        this.positions = {};                // Objeto con las 13 posiciones del tablero (A-K)
        
        // 🎮 ESTADO DEL JUEGO
        this.gameInProgress = false;        // Indica si hay un juego activo
        this.currentPosition = 'K';         // Posición actual del turno (siempre inicia en K)
        this.currentMode = 'manual';        // Modo de juego: 'manual' o 'auto'
        this.shuffleType = 'perfect';       // Tipo de barajado: 'perfect' o 'imperfect'
        
        // 🖱️ CONTROL DE INTERFAZ
        this.draggedCard = null;            // Carta que se está arrastrando actualmente
        this.isDealing = false;             // Protección contra múltiples llamadas de distribución
        
        // � SISTEMA DE TURNOS DETALLADO
        this.turnState = {
            canFlipCard: true,              // ¿Se puede voltear una carta en este turno?
            flippedThisTurn: false,         // ¿Ya se volteó una carta este turno?
            lastFlippedFrom: null,          // ¿De qué posición se volteó la última carta?
            waitingForAction: false         // ¿Esperando que el jugador mueva la carta?
        };
        
        // 🚀 INICIALIZACIÓN AUTOMÁTICA
        this.initializeGame();              // Configurar estructuras básicas del juego
        this.setupEventListeners();        // Configurar eventos de la interfaz
    }

    /**
     * =====================================================
     * 🏗️ INICIALIZACIÓN DEL JUEGO
     * =====================================================
     * 
     * Método principal que coordina la inicialización de todas
     * las estructuras de datos necesarias para el juego.
     * 
     * PROCESOS DE INICIALIZACIÓN:
     * 1. Crear la baraja completa de 52 cartas
     * 2. Inicializar las 13 posiciones del tablero
     * 3. Configurar estado inicial del juego
     * 
     * NOTA: Este método se ejecuta automáticamente en el constructor
     * y cada vez que se reinicia el juego.
     * =====================================================
     */
    initializeGame() {
        console.log('=== INICIALIZANDO JUEGO ===');
        this.createDeck();              // Crear baraja de 52 cartas
        this.initializePositions();     // Configurar posiciones A-K
        console.log('=== INICIALIZACIÓN COMPLETA ===');
    }

    /**
     * =====================================================
     * 🃏 CREACIÓN DE LA BARAJA
     * =====================================================
     * 
     * Genera una baraja estándar de 52 cartas con todos los
     * palos y valores. Cada carta tiene propiedades únicas.
     * 
     * ESTRUCTURA DE CARTA:
     * {
     *   suit: 'C'|'D'|'H'|'S',    // Palo (Clubs, Diamonds, Hearts, Spades)
     *   value: 'A'-'K',            // Valor (A, 2-10, J, Q, K)
     *   revealed: boolean,         // ¿Está boca arriba?
     *   id: string                 // ID único (ej: "K-S")
     * }
     * 
     * VALIDACIÓN:
     * - Verifica que se generen exactamente 52 cartas
     * - Confirma que todas las cartas sean únicas
    /**
     * =====================================================
     * 🃏 CREACIÓN DE LA BARAJA
     * =====================================================
     * 
     * Genera una baraja estándar de 52 cartas con todos los
     * palos y valores. Cada carta tiene propiedades únicas.
     * 
     * ESTRUCTURA DE CARTA:
     * {
     *   suit: 'C'|'D'|'H'|'S',    // Palo (Clubs, Diamonds, Hearts, Spades)
     *   value: 'A'-'K',            // Valor (A, 2-10, J, Q, K)
     *   revealed: boolean,         // ¿Está boca arriba?
     *   id: string                 // ID único (ej: "K-S")
     * }
     * 
     * VALIDACIÓN:
     * - Verifica que se generen exactamente 52 cartas
     * - Confirma que todas las cartas sean únicas
     * =====================================================
     */
    createDeck() {
        console.log('🃏 Creando deck completo...');
        
        // 📋 DEFINICIÓN DE PALOS Y VALORES
        const suits = ['C', 'D', 'H', 'S'];     // Clubs, Diamonds, Hearts, Spades
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        // 🔄 GENERACIÓN DE CARTAS
        this.deck = [];
        suits.forEach(suit => {
            values.forEach(value => {
                this.deck.push({
                    suit: suit,                 // Palo de la carta
                    value: value,               // Valor de la carta
                    revealed: false,            // Inicialmente todas boca abajo
                    id: `${value}-${suit}`      // ID único para identificación
                });
            });
        });
        
        console.log('✅ Deck creado con', this.deck.length, 'cartas');
        
        // 🔍 VALIDACIÓN DE INTEGRIDAD
        const uniqueCards = new Set(this.deck.map(card => card.id));
        console.log('🔍 Verificación - Cartas únicas:', uniqueCards.size);
        
        if (this.deck.length !== 52 || uniqueCards.size !== 52) {
            console.error('❌ ERROR: Número incorrecto de cartas en el deck!');
        } else {
            console.log('✅ Deck validado correctamente');
        }
    }

    /**
     * =====================================================
     * 🏗️ INICIALIZACIÓN DE POSICIONES
     * =====================================================
     * 
     * Configura las 13 posiciones del tablero (A-K) donde
     * se colocarán las cartas durante el juego.
     * 
     * ESTRUCTURA DE POSICIÓN:
     * {
     *   faceDown: [],    // Array de cartas boca abajo
     *   faceUp: []       // Array de cartas boca arriba
     * }
     * 
     * ORDEN DE POSICIONES:
     * A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K
     * 
     * NOTA: Cada posición puede contener hasta 4 cartas del mismo valor.
     * =====================================================
     */
    initializePositions() {
        console.log('🏗️ Inicializando posiciones del tablero...');
        
        // 📋 DEFINICIÓN DE POSICIONES
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.positions = {};
        
        // 🔄 CREACIÓN DE ESTRUCTURAS DE POSICIÓN
        positionNames.forEach(pos => {
            this.positions[pos] = {
                faceDown: [],               // Cartas boca abajo en esta posición
                faceUp: []                  // Cartas boca arriba en esta posición
            };
        });
        
        console.log('✅ Posiciones inicializadas:', Object.keys(this.positions).length, 'posiciones');
        console.log('📍 Posiciones creadas:', Object.keys(this.positions));
    }

    /**
     * =====================================================
     * 🔀 SISTEMA DE BARAJADO
     * =====================================================
     * 
     * Baraja las cartas usando diferentes algoritmos según
     * el tipo especificado. Esto añade aleatoriedad al juego.
     * 
     * TIPOS DE BARAJADO:
     * - 'perfect': Riffle shuffle (barajado perfecto)
     * - 'imperfect': Fisher-Yates shuffle (barajado aleatorio)
     * 
     * @param {string} type - Tipo de barajado a usar
     * =====================================================
     */
    shuffleDeck(type = 'perfect') {
        console.log('🔀 Barajando deck con tipo:', type);
        
        // 🎯 SELECCIÓN DE ALGORITMO DE BARAJADO
        if (type === 'perfect') {
            this.riffleShuffle();           // Barajado riffle (más realista)
        } else {
            this.imperfectShuffle();        // Barajado Fisher-Yates (completamente aleatorio)
        }
        
        console.log('✅ Deck barajado. Primeras 5 cartas:', this.deck.slice(0, 5));
    }

    /**
     * =====================================================
     * 🎴 RIFFLE SHUFFLE (Barajado Perfecto)
     * =====================================================
     * 
     * Simula el barajado tipo "riffle" usado en casinos.
     * Divide la baraja en dos mitades y las intercala
     * de manera semi-aleatoria.
     * 
     * PROCESO:
     * 1. Dividir baraja en dos mitades
     * 2. Intercalar cartas alternativamente
     * 3. Agregar variación aleatoria ligera
     * 
     * VENTAJA: Más realista que shuffle completamente aleatorio
     * =====================================================
     */
    riffleShuffle() {
        console.log('🎴 Ejecutando Riffle Shuffle...');
        
        // 📏 DIVISIÓN EN MITADES
        const mid = Math.floor(this.deck.length / 2);
        const left = this.deck.slice(0, mid);       // Primera mitad
        const right = this.deck.slice(mid);         // Segunda mitad
        
        // 🔄 INTERCALADO DE CARTAS
        this.deck = [];
        let leftIndex = 0, rightIndex = 0;
        
        while (leftIndex < left.length || rightIndex < right.length) {
            // 🎲 ALTERNAR CON VARIACIÓN ALEATORIA
            if (leftIndex < left.length && (rightIndex >= right.length || Math.random() > 0.5)) {
                this.deck.push(left[leftIndex++]);
            } else if (rightIndex < right.length) {
                this.deck.push(right[rightIndex++]);
            }
        }
        
        console.log('✅ Riffle Shuffle completado');
    }

    /**
     * =====================================================
     * 🎲 FISHER-YATES SHUFFLE (Barajado Aleatorio)
     * =====================================================
     * 
     * Implementa el algoritmo Fisher-Yates para un barajado
     * completamente aleatorio y uniformemente distribuido.
     * 
     * PROCESO:
     * 1. Iterar desde la última carta hacia la primera
     * 2. Para cada posición, elegir una carta aleatoria
     * 3. Intercambiar las cartas de posición
     * 
     * VENTAJA: Distribución perfectamente uniforme
     * =====================================================
     */
    imperfectShuffle() {
        console.log('🎲 Ejecutando Fisher-Yates Shuffle...');
        
        // 🔄 ALGORITMO FISHER-YATES
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));     // Índice aleatorio
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];   // Intercambio
        }
        
        console.log('✅ Fisher-Yates Shuffle completado');
    }

    dealCards() {
        console.log('🎴 === INICIANDO DISTRIBUCIÓN VISUAL DE CARTAS ===');
        
        // �️ PROTECCIÓN: Evitar múltiples llamadas
        if (this.isDealing) {
            console.warn('⚠️ dealCards() ya está en progreso, ignorando llamada duplicada');
            return;
        }
        this.isDealing = true;
        
        // �📋 CORREGIDO: Usar todas las 13 posiciones como se muestra en el HTML
        const allPositions = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        // 🧹 LIMPIAR COMPLETAMENTE TODAS LAS POSICIONES
        console.log('🧹 Limpiando posiciones antes del reparto...');
        this.initializePositions();
        
        // 🔍 VERIFICACIÓN EXHAUSTIVA DEL DECK
        console.log('Verificando deck antes del reparto:');
        console.log('- Cartas en deck:', this.deck.length);
        console.log('- Posiciones totales:', allPositions.length);
        console.log('- Cartas por posición: 4');
        console.log('- Total requerido: 52 cartas');
        
        // Verificar que no hay cartas duplicadas
        const cardIds = this.deck.map(card => card.id);
        const uniqueIds = [...new Set(cardIds)];
        console.log('- IDs únicos en deck:', uniqueIds.length);
        
        if (this.deck.length !== 52) {
            console.error('ERROR: El deck no tiene 52 cartas!');
            this.isDealing = false;
            return;
        }
        
        if (uniqueIds.length !== 52) {
            console.error('ERROR: Hay cartas duplicadas en el deck!');
            console.log('Cartas duplicadas:', cardIds.filter((id, index) => cardIds.indexOf(id) !== index));
            this.isDealing = false;
            return;
        }
        
        // 🎬 MOSTRAR ANIMACIÓN DE BARAJADO PRIMERO
        this.showShuffleAnimation().then(() => {
            this.animateCardDistribution(allPositions);
        });
    }

    showShuffleAnimation() {
        console.log('🔄 Iniciando animación de barajado...');
        
        return new Promise((resolve) => {
            // Mostrar pantalla de barajado
            this.showScreen('shuffle-screen');
            
            // Simular barajado visual por 3 segundos
            setTimeout(() => {
                console.log('✅ Barajado visual completado');
                this.showScreen('game-screen');
                resolve();
            }, 3000);
        });
    }

    animateCardDistribution(positions) {
        console.log('🎯 Iniciando distribución animada de cartas a 13 pilas...');
        console.log('📊 Estado inicial del deck:', this.deck.length, 'cartas');
        
        let cardIndex = 0;
        let delay = 0;
        const usedCardIds = new Set(); // Para evitar duplicados
        
        // 📋 NUEVA LÓGICA: Distribuir secuencialmente sin bucles anidados
        // Repartir exactamente 4 cartas a cada posición de forma ordenada
        
        positions.forEach((pos, posIndex) => {
            console.log(`🎯 Iniciando distribución para posición ${pos}...`);
            
            // Para cada posición, agregar exactamente 4 cartas
            for (let cardInPosition = 0; cardInPosition < 4; cardInPosition++) {
                if (cardIndex < 52 && cardIndex < this.deck.length) {
                    const card = this.deck[cardIndex];
                    
                    // 🔍 VERIFICAR QUE NO ES DUPLICADA
                    if (usedCardIds.has(card.id)) {
                        console.error(`❌ ERROR: Carta duplicada detectada: ${card.id}`);
                        return;
                    }
                    usedCardIds.add(card.id);
                    
                    card.revealed = false;
                    
                    console.log(`📋 Programando carta ${cardIndex + 1}/52: ${card.id} → Posición ${pos}`);
                    
                    // Programar la animación de "vuelo" de carta
                    setTimeout(() => {
                        this.flyCardToPosition(card, pos, cardIndex);
                        this.positions[pos].faceDown.push(card);
                        
                        console.log(`✅ Carta colocada: ${card.id} → Posición ${pos} (Cartas en pila: ${this.positions[pos].faceDown.length})`);
                        
                        // Si es la última carta, finalizar distribución
                        if (cardIndex === 51) {
                            setTimeout(() => {
                                this.finishCardDistribution();
                            }, 500);
                        }
                    }, delay);
                    
                    delay += 100; // 100ms entre cada carta para ver la secuencia
                    cardIndex++;
                } else {
                    console.error(`❌ ERROR: cardIndex fuera de rango: ${cardIndex}`);
                    break;
                }
            }
        });
        
        console.log(`📊 Programadas ${cardIndex} cartas para distribución`);
    }

    flyCardToPosition(card, position, index) {
        // Crear elemento de carta voladora para animación
        const flyingCard = document.createElement('div');
        flyingCard.className = 'flying-card';
        flyingCard.innerHTML = `<img src="img/cards/Backcard.png" alt="Carta volando">`;
        
        // Posicionar en el centro de la pantalla (origen)
        flyingCard.style.position = 'fixed';
        flyingCard.style.left = '50%';
        flyingCard.style.top = '50%';
        flyingCard.style.transform = 'translate(-50%, -50%)';
        flyingCard.style.zIndex = '1000';
        flyingCard.style.transition = 'all 0.8s ease-out';
        
        document.body.appendChild(flyingCard);
        
        // Obtener posición destino
        const targetElement = document.querySelector(`[data-position="${position}"] .face-down-stack`);
        
        if (targetElement) {
            const targetRect = targetElement.getBoundingClientRect();
            
            // Animar hacia la posición destino
            setTimeout(() => {
                flyingCard.style.left = targetRect.left + targetRect.width/2 + 'px';
                flyingCard.style.top = targetRect.top + targetRect.height/2 + 'px';
                flyingCard.style.transform = 'translate(-50%, -50%) scale(0.8)';
                flyingCard.style.opacity = '0.8';
            }, 50);
            
            // Remover carta voladora después de la animación
            setTimeout(() => {
                if (flyingCard.parentNode) {
                    document.body.removeChild(flyingCard);
                }
                
                // Agregar carta real a la pila
                this.renderSingleCard(card, position, 'faceDown');
            }, 900);
        }
    }

    renderSingleCard(card, position, pileType) {
        const stackElement = document.querySelector(`[data-position="${position}"] .face-down-stack`);
        if (stackElement) {
            const cardElement = this.createCardElement(card, position, this.positions[position].faceDown.length - 1, pileType);
            stackElement.appendChild(cardElement);
        }
    }

    finishCardDistribution() {
        console.log('� === FINALIZANDO DISTRIBUCIÓN ===');
        
        // 📊 VERIFICAR que cada posición tenga exactamente 4 cartas
        const allPositions = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        let totalCardsDistributed = 0;
        
        allPositions.forEach(pos => {
            const cardsInPosition = this.positions[pos].faceDown.length;
            totalCardsDistributed += cardsInPosition;
            console.log(`📍 Posición ${pos}: ${cardsInPosition} cartas boca abajo`);
            
            if (cardsInPosition !== 4) {
                console.warn(`⚠️ ADVERTENCIA: Posición ${pos} tiene ${cardsInPosition} cartas, debería tener 4`);
            }
        });
        
        console.log(`📊 Total de cartas distribuidas: ${totalCardsDistributed}/52`);
        
        if (totalCardsDistributed === 52) {
            console.log('✅ Distribución correcta: 52 cartas repartidas en 13 pilas de 4 cartas cada una');
        } else {
            console.error(`❌ Error en distribución: se repartieron ${totalCardsDistributed} cartas en lugar de 52`);
        }
        
        // Continuar con la lógica original
        this.renderBoard();
        this.updateGameInfo();
        
        // Actualizar controles
        const startBtn = document.getElementById('start-game');
        const autoBtn = document.getElementById('auto-play');
        
        if (startBtn) startBtn.disabled = true;
        if (autoBtn) autoBtn.disabled = false;
    }

    // Esta función ya está definida arriba, eliminar duplicado

    animatedDealCards() {
        console.log('Ejecutando animatedDealCards...');
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        let dealDelay = 0;
        let cardIndex = 0;
        
        console.log('Deck actual:', this.deck);
        console.log('Número de cartas en deck:', this.deck.length);
        
        // Repartir 4 cartas a cada posición con animación
        for (let round = 0; round < 4; round++) {
            positionNames.forEach(pos => {
                if (cardIndex < this.deck.length) {
                    setTimeout(() => {
                        console.log(`Repartiendo carta ${cardIndex} a posición ${pos}`);
                        const card = this.deck[cardIndex];
                        card.revealed = false;
                        this.positions[pos].faceDown.push(card);
                        
                        // Renderizar solo esa posición para el efecto de reparto
                        const faceDownElement = document.querySelector(`[data-position="${pos}"] .face-down-stack`);
                        console.log(`Elemento face-down-stack para ${pos}:`, faceDownElement);
                        if (faceDownElement) {
                            const cardElement = this.createCardElement(card, pos, this.positions[pos].faceDown.length - 1, 'faceDown');
                            faceDownElement.appendChild(cardElement);
                            console.log(`Carta agregada a ${pos}`);
                        } else {
                            console.error(`No se encontró elemento face-down-stack para posición ${pos}`);
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
            
            // 📊 ACTUALIZAR CONTADORES DE CARTAS
            if (faceDownElement) {
                faceDownElement.setAttribute('data-count', this.positions[pos].faceDown.length);
            }
            if (faceUpElement) {
                faceUpElement.setAttribute('data-count', this.positions[pos].faceUp.length);
            }
            
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
        cardElement.dataset.card = `${card.value}-${card.suit}`;
        cardElement.dataset.position = position;
        cardElement.dataset.index = index;
        cardElement.dataset.pileType = pileType;
        
        const img = document.createElement('img');
        
        if (pileType === 'faceDown') {
            // Carta boca abajo - mostrar reverso
            img.src = 'img/cards/Backcard.png';
            img.alt = 'Carta boca abajo';
            cardElement.classList.add('face-down');
            
            // Solo la carta superior de la pila boca abajo puede ser clickeada
            if (index === this.positions[position].faceDown.length - 1) {
                cardElement.style.cursor = 'pointer';
                cardElement.addEventListener('click', () => {
                    if (this.gameInProgress && position === this.currentPosition) {
                        // 🎮 VERIFICAR CONTROL DE TURNOS ANTES DE PERMITIR VOLTEO
                        if (this.turnState.canFlipCard) {
                            this.flipTopCard(position);
                        } else {
                            this.showTurnMessage("Ya volteaste una carta este turno. Mueve la carta actual primero.");
                        }
                    }
                });
            }
        } else {
            // Carta boca arriba - mostrar frente
            img.src = `img/cards/${card.value}-${card.suit}.png`;
            img.alt = `${card.value} de ${card.suit}`;
            cardElement.classList.add('face-up');
            
            // ✅ DRAG & DROP: Solo cartas boca arriba pueden arrastrarse
            // Solo la carta superior de la pila puede ser arrastrada
            if (index === this.positions[position].faceUp.length - 1) {
                this.makeDraggable(cardElement, card, position, index, pileType);
            }
        }
        
        img.alt = pileType === 'faceDown' ? 'Carta boca abajo' : `${card.value} of ${card.suit}`;
        cardElement.appendChild(img);
        
        return cardElement;
    }

    /* =====================================================
       SISTEMA DE DRAG & DROP
    ===================================================== */
    makeDraggable(cardElement, card, position, index, pileType) {
        // Solo permitir arrastre en modo manual y si el juego está en progreso
        if (!this.gameInProgress || this.currentMode !== 'manual') {
            return;
        }

        cardElement.draggable = true;
        cardElement.style.cursor = 'grab';
        
        cardElement.addEventListener('dragstart', (e) => {
            console.log(`🎯 Arrastrando carta: ${card.value}-${card.suit} desde posición ${position}`);
            
            // Guardar información de la carta arrastrada
            this.draggedCard = {
                card: card,
                fromPosition: position,
                fromIndex: index,
                fromPile: pileType
            };
            
            // Efectos visuales durante el arrastre
            cardElement.style.cursor = 'grabbing';
            cardElement.classList.add('dragging');
            
            // ✨ Iluminar zonas válidas donde puede soltarse
            this.highlightValidDropZones(card.value);
            
            e.dataTransfer.setData('text/plain', '');
        });
        
        cardElement.addEventListener('dragend', () => {
            console.log(`🎯 Terminando arrastre de carta: ${card.value}-${card.suit}`);
            
            // Restaurar apariencia normal
            cardElement.style.cursor = 'grab';
            cardElement.classList.remove('dragging');
            
            // Limpiar highlighting de zonas
            this.clearDropZoneHighlights();
            
            // Limpiar datos de arrastre
            this.draggedCard = null;
        });
    }

    flipTopCard(position) {
        console.log(`🔄 === INTENTANDO VOLTEAR CARTA EN POSICIÓN ${position} ===`);
        
        // 🛡️ VERIFICAR CONTROL DE TURNOS
        if (!this.turnState.canFlipCard) {
            console.log(`🚫 No se puede voltear carta: Ya se volteó una carta este turno`);
            console.log(`📋 Estado del turno:`, this.turnState);
            this.showTurnMessage("Ya volteaste una carta este turno. Mueve la carta actual primero.");
            return null;
        }
        
        const faceDownPile = this.positions[position].faceDown;
        
        if (faceDownPile.length === 0) {
            console.log(`No hay cartas boca abajo en posición ${position}`);
            return null;
        }
        
        // 🎯 VOLTEAR LA CARTA
        const card = faceDownPile.pop();
        card.revealed = true;
        
        console.log(`🎴 Carta volteada: ${card.value}-${card.suit} desde posición ${position}`);
        
        // ✨ AGREGAR A LA PILA BOCA ARRIBA DE LA MISMA POSICIÓN
        this.positions[position].faceUp.push(card);
        
        // 🎮 VERIFICAR INMEDIATAMENTE SI LA CARTA PERTENECE A ESTA POSICIÓN
        const cardBelongsHere = (card.value === position);
        
        if (cardBelongsHere) {
            console.log(`🔁 ¡ACIERTO! La carta ${card.value} pertenece a la posición ${position}`);
            console.log(`🎯 Permitiendo voltear otra carta inmediatamente`);
            
            // La carta se queda donde está - permitir otro volteo inmediatamente
            this.turnState.canFlipCard = true;
            this.turnState.waitingForAction = false;
            this.showTurnMessage(`¡Acierto! La carta ${card.value} pertenece aquí. Puedes voltear otra.`);
        } else {
            console.log(`❌ La carta ${card.value} NO pertenece a la posición ${position}`);
            console.log(`🎯 El jugador debe moverla a la posición ${card.value} manualmente`);
            
            // Bloquear volteos hasta que se mueva la carta
            this.turnState.flippedThisTurn = true;
            this.turnState.lastFlippedFrom = position;
            this.turnState.waitingForAction = true;
            this.turnState.canFlipCard = false;
            this.showTurnMessage(`Carta ${card.value} debe moverse a su posición correcta.`);
        }
        
        console.log(`🎮 Estado del turno actualizado:`, this.turnState);
        
        // Mostrar estado de las pilas
        console.log('--- Estado después del volteo ---');
        console.log(`Posición ${position}: ${this.positions[position].faceDown.length} boca abajo, ${this.positions[position].faceUp.length} boca arriba`);
        
        // Renderizar para mostrar la carta volteada
        this.renderBoard();
        this.updateGameInfo();
        
        // 🎮 Verificar condiciones de Game Over después del volteo
        this.checkGameStateAfterFlip();
        
        return card;
    }

    checkGameStateAfterFlip() {
        // Verificar si ya no hay cartas boca abajo en ninguna posición (las 13)
        const allPositions = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        let totalFaceDown = 0;
        
        allPositions.forEach(pos => {
            totalFaceDown += this.positions[pos].faceDown.length;
        });
        
        console.log(`📊 Cartas boca abajo restantes: ${totalFaceDown}`);
        
        if (totalFaceDown === 0) {
            // Ya no hay cartas por voltear
            if (!this.allCardsInCorrectPosition()) {
                console.log('🚫 Game Over: No hay más cartas por voltear pero no todas están en su posición correcta');
                this.gameOver();
            } else {
                console.log('🎉 ¡Victoria! Todas las cartas están en su posición correcta');
                this.endGame(true);
            }
        }
    }

    allCardsInCorrectPosition() {
        // 📋 CORREGIDO: Verificar todas las 13 posiciones
        const allPositions = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        for (let pos of allPositions) {
            const position = this.positions[pos];
            
            // Verificar que cada posición tenga exactamente 4 cartas del valor correcto
            if (position.faceUp.length !== 4) {
                console.log(`❌ Posición ${pos} tiene ${position.faceUp.length} cartas, pero necesita 4`);
                return false;
            }
            
            // Verificar que todas las cartas boca arriba estén en su posición correcta
            for (let card of position.faceUp) {
                if (card.value !== pos) {
                    console.log(`❌ Carta ${card.value}-${card.suit} está en posición ${pos} pero debería estar en ${card.value}`);
                    return false;
                }
            }
        }
        
        console.log('✅ Todas las 52 cartas están en su posición correcta');
        return true;
    }

    /* =====================================================
       FASE 3: LÓGICA DEL JUEGO
    ===================================================== */
    startGame() {
        if (this.gameInProgress) return;
        
        console.log('Iniciando juego...');
        this.gameInProgress = true;
        this.currentPosition = 'K'; // Siempre comenzar desde K
        
        // 🎮 RESETEAR ESTADO DE TURNO AL INICIAR
        this.resetTurn();
        
        // Habilitar controles
        document.getElementById('auto-play').disabled = false;
        document.getElementById('start-game').disabled = true;
        
        console.log(`Juego iniciado desde posición ${this.currentPosition}`);
        
        // Renderizar para mostrar la posición actual resaltada
        this.renderBoard();
        
        // Si es modo automático, comenzar proceso automático
        if (this.currentMode === 'auto') {
            setTimeout(() => {
                this.startAutoPlay();
            }, 1000);
        }
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
        // Mapeo directo: el valor de la carta ES su posición destino
        return cardValue;
    }

    checkGameEnd() {
        console.log('=== VERIFICANDO CONDICIONES DE FIN DE JUEGO ===');
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        // Verificar si alguna pila boca arriba tiene exactamente 4 cartas del mismo valor
        for (let pos of positionNames) {
            const faceUpPile = this.positions[pos].faceUp;
            
            console.log(`Verificando posición ${pos}: ${faceUpPile.length} cartas boca arriba`);
            
            if (faceUpPile.length >= 4) {
                // Contar cuántas cartas tienen el valor correcto para esta posición
                const correctCards = faceUpPile.filter(card => card.value === pos);
                console.log(`Posición ${pos}: ${correctCards.length} cartas correctas de ${faceUpPile.length} total`);
                
                if (correctCards.length >= 4) {
                    console.log(`¡JUEGO TERMINADO! Pila ${pos} completada con 4 cartas del valor ${pos}!`);
                    
                    if (pos === 'K') {
                        console.log('La pila K se completó - Resultado: NO');
                        this.endGame(false);
                    } else {
                        console.log(`La pila ${pos} se completó - Resultado: SÍ`);
                        this.endGame(true);
                    }
                    return true;
                }
            }
        }
        
        // Verificar si no hay más cartas boca abajo en la posición actual
        const currentFaceDownPile = this.positions[this.currentPosition].faceDown;
        console.log(`Posición actual ${this.currentPosition}: ${currentFaceDownPile.length} cartas boca abajo restantes`);
        
        if (currentFaceDownPile.length === 0) {
            // Buscar otra posición con cartas boca abajo
            let foundAlternative = false;
            for (let pos of positionNames) {
                if (this.positions[pos].faceDown.length > 0) {
                    console.log(`Cambiando a posición ${pos} que tiene ${this.positions[pos].faceDown.length} cartas boca abajo`);
                    this.currentPosition = pos;
                    foundAlternative = true;
                    this.renderBoard(); // Actualizar resaltado
                    break;
                }
            }
            
            if (!foundAlternative) {
                // Verificar si hay cartas boca arriba que se puedan mover
                if (this.hasMovableCards()) {
                    console.log('No hay cartas boca abajo pero hay cartas movibles - continúa el juego');
                    return false;
                } else {
                    console.log('No hay más cartas boca abajo ni cartas movibles - Game Over');
                    this.gameOver();
                    return true;
                }
            }
        }
        
        console.log('Juego continúa...');
        return false;
    }

    hasMovableCards() {
        // Verificar si hay cartas boca arriba que se puedan mover a otras posiciones
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        for (let pos of positionNames) {
            const faceUpPile = this.positions[pos].faceUp;
            if (faceUpPile.length > 0) {
                const topCard = faceUpPile[faceUpPile.length - 1];
                // Verificar si esta carta puede moverse a su posición correcta
                if (topCard.value !== pos) {
                    console.log(`Carta ${topCard.value}-${topCard.suit} en posición ${pos} puede moverse`);
                    return true;
                }
            }
        }
        return false;
    }

    gameOver() {
        console.log('=== GAME OVER ===');
        this.gameInProgress = false;
        
        // Deshabilitar controles
        document.getElementById('auto-play').disabled = true;
        document.getElementById('start-game').disabled = false;
        
        // Mostrar modal de Game Over
        this.showGameOverModal();
    }

    showGameOverModal() {
        // Crear modal de Game Over si no existe
        let gameOverModal = document.getElementById('game-over-modal');
        
        if (!gameOverModal) {
            gameOverModal = document.createElement('div');
            gameOverModal.id = 'game-over-modal';
            gameOverModal.className = 'modal';
            gameOverModal.innerHTML = `
                <div class="modal-content">
                    <h2>🎮 Game Over</h2>
                    <p>No hay más movimientos disponibles</p>
                    <div class="game-over-buttons">
                        <button id="play-again-btn" class="mode-button">
                            <span>🔄</span>
                            <p>Jugar de Nuevo</p>
                        </button>
                        <button id="back-to-home-btn" class="mode-button">
                            <span>🏠</span>
                            <p>Ir a Inicio</p>
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(gameOverModal);
            
            // Agregar event listeners
            document.getElementById('play-again-btn').addEventListener('click', () => {
                this.hideGameOverModal();
                this.resetGame();
                this.showModeModal();
            });
            
            document.getElementById('back-to-home-btn').addEventListener('click', () => {
                this.hideGameOverModal();
                this.showScreen('home-screen');
            });
        }
        
        gameOverModal.classList.remove('hidden');
    }

    hideGameOverModal() {
        const gameOverModal = document.getElementById('game-over-modal');
        if (gameOverModal) {
            gameOverModal.classList.add('hidden');
        }
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
        
        console.log(`Paso automático en posición ${this.currentPosition}`);
        
        // Verificar fin de juego antes de cada paso
        if (this.checkGameEnd()) return;
        
        // Resaltar posición actual
        this.highlightPosition(this.currentPosition);
        
        // Verificar si hay cartas boca abajo en la posición actual
        const currentFaceDownPile = this.positions[this.currentPosition].faceDown;
        
        if (currentFaceDownPile.length > 0) {
            console.log(`Volteando carta en posición ${this.currentPosition}`);
            
            // Voltear carta (esto automáticamente la mueve a su destino)
            this.flipTopCard(this.currentPosition);
            
            // Continuar después de un delay
            setTimeout(() => {
                this.autoPlayStep();
            }, 1500);
        } else {
            console.log(`No hay más cartas en posición ${this.currentPosition}, verificando fin de juego`);
            this.checkGameEnd();
        }
    }

    canPlaceCardInPosition(position) {
        // Permitir colocar cartas siempre, no hay límite estricto de 4
        // El juego termina cuando una pila se llena con 4 cartas del mismo valor
        return true;
    }

    highlightValidDropZones(cardValue) {
        console.log(`🌟 Iluminando zona válida para carta ${cardValue}`);
        
        // 🔒 RESTRICCIÓN: Solo la posición que corresponde al valor de la carta
        const validPosition = document.querySelector(`[data-position="${cardValue}"]`);
        
        if (validPosition) {
            // ✨ Efectos visuales de iluminación
            validPosition.classList.add('valid-drop-zone', 'highlighted');
            
            // Iluminar específicamente la pila boca arriba (donde se puede soltar)
            const faceUpStack = validPosition.querySelector('.face-up-stack');
            if (faceUpStack) {
                faceUpStack.classList.add('drop-target');
            }
            
            console.log(`✅ Zona ${cardValue} iluminada correctamente`);
        } else {
            console.warn(`⚠️ No se encontró posición para carta ${cardValue}`);
        }
    }

    clearDropZoneHighlights() {
        console.log('🧹 Limpiando iluminación de zonas');
        
        // Remover todas las clases de highlighting
        const classesToRemove = ['valid-drop-zone', 'highlighted', 'drop-target', 'drag-over-valid', 'drag-over-invalid'];
        
        classesToRemove.forEach(className => {
            document.querySelectorAll(`.${className}`).forEach(element => {
                element.classList.remove(className);
            });
        });
        
        console.log('✅ Todas las zonas limpiadas');
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
        console.log('🎯 Configurando zonas de drop con validación estricta...');
        const positions = document.querySelectorAll('.card-position');
        
        positions.forEach(position => {
            const faceUpStack = position.querySelector('.face-up-stack');
            const faceDownStack = position.querySelector('.face-down-stack');
            
            // 🔒 BLOQUEAR pilas boca abajo para recibir cartas
            if (faceDownStack) {
                faceDownStack.classList.add('blocked');
                
                faceDownStack.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    faceDownStack.classList.add('drag-over-invalid');
                });
                
                faceDownStack.addEventListener('dragleave', () => {
                    faceDownStack.classList.remove('drag-over-invalid');
                });
                
                faceDownStack.addEventListener('drop', (e) => {
                    e.preventDefault();
                    faceDownStack.classList.remove('drag-over-invalid');
                    console.log('❌ Drop rechazado: No se pueden agregar cartas a pilas boca abajo');
                    this.showInvalidDropFeedback(faceDownStack);
                });
            }
            
            // ✅ Configurar pilas boca arriba (válidas para recibir cartas)
            if (faceUpStack) {
                // Evento dragover - validar en tiempo real
                faceUpStack.addEventListener('dragover', (e) => {
                    e.preventDefault(); // Permitir drop
                    
                    if (this.draggedCard) {
                        const targetPosition = position.dataset.position;
                        const cardValue = this.draggedCard.card.value;
                        
                        // 🔒 VALIDACIÓN ESTRICTA: Solo posición correcta
                        if (cardValue === targetPosition) {
                            faceUpStack.classList.add('drag-over-valid');
                            faceUpStack.classList.remove('drag-over-invalid');
                        } else {
                            faceUpStack.classList.add('drag-over-invalid');
                            faceUpStack.classList.remove('drag-over-valid');
                        }
                    }
                });
                
                // Limpiar estilos al salir del área
                faceUpStack.addEventListener('dragleave', () => {
                    faceUpStack.classList.remove('drag-over-valid', 'drag-over-invalid');
                });
                
                // Evento drop - ejecutar movimiento solo si es válido
                faceUpStack.addEventListener('drop', (e) => {
                    e.preventDefault();
                    faceUpStack.classList.remove('drag-over-valid', 'drag-over-invalid');
                    
                    if (this.draggedCard) {
                        const targetPosition = position.dataset.position;
                        const cardValue = this.draggedCard.card.value;
                        
                        console.log(`🎯 Drop: Carta ${cardValue} → Posición ${targetPosition}`);
                        
                        // ✅ VERIFICACIÓN FINAL: Solo permitir drop en posición correcta
                        if (this.isValidDrop(cardValue, targetPosition)) {
                            console.log('✅ Drop válido - ejecutando movimiento');
                            this.performManualMove(this.draggedCard, targetPosition);
                        } else {
                            console.log('❌ Drop inválido - carta rechazada');
                            // Opcional: mostrar feedback visual de rechazo
                            this.showInvalidDropFeedback(faceUpStack);
                        }
                        
                        this.draggedCard = null;
                        this.clearDropZoneHighlights();
                    }
                });
            }
        });
        
        console.log('✅ Zonas de drop configuradas correctamente');
    }

    showInvalidDropFeedback(element) {
        // Animación de "rechazo" cuando el drop es inválido
        element.classList.add('invalid-drop-shake');
        
        setTimeout(() => {
            element.classList.remove('invalid-drop-shake');
        }, 600);
    }

    isValidDrop(cardValue, targetPosition) {
        // La carta solo puede ir a la posición que coincide con su valor
        return cardValue === targetPosition;
    }

    performManualMove(dragInfo, targetPosition) {
        console.log(`=== MOVIMIENTO MANUAL ===`);
        console.log(`Moviendo carta ${dragInfo.card.value}-${dragInfo.card.suit} de ${dragInfo.fromPosition} a ${targetPosition}`);
        
        // Remover carta de la posición origen (solo de pila faceUp)
        const fromPosition = dragInfo.fromPosition;
        const removedCard = this.positions[fromPosition].faceUp.pop();
        
        if (!removedCard) {
            console.error('Error: No se pudo remover la carta de la posición origen');
            return;
        }
        
        // Agregar carta a la pila faceUp de la posición destino
        this.positions[targetPosition].faceUp.push(removedCard);
        
        // Actualizar posición actual al destino
        this.currentPosition = targetPosition;
        
        console.log(`Carta movida exitosamente. Nueva posición actual: ${this.currentPosition}`);
        
        // 🎮 MANEJAR ESTADO DEL TURNO DESPUÉS DEL MOVIMIENTO
        this.handleTurnAfterMove(fromPosition, targetPosition);
        
        // Renderizar y verificar estado del juego
        this.renderBoard();
        this.checkGameStateAfterManualMove();
    }

    handleTurnAfterMove(fromPosition, targetPosition) {
        console.log(`🎮 === MANEJANDO TURNO DESPUÉS DEL MOVIMIENTO ===`);
        console.log(`Movimiento: ${fromPosition} → ${targetPosition}`);
        console.log(`Estado del turno antes:`, this.turnState);
        
        // 🔁 REGLA ESPECIAL: Si la carta se queda en su misma pila de origen, permitir otro volteo
        if (fromPosition === targetPosition && fromPosition === this.turnState.lastFlippedFrom) {
            console.log(`🔁 Carta quedó en su pila de origen (${fromPosition}). Permitiendo otro volteo.`);
            this.turnState.canFlipCard = true;
            this.turnState.waitingForAction = false;
            // NO resetear flippedThisTurn ni lastFlippedFrom para mantener el contexto
        } else {
            console.log(`🔄 Carta movida a diferente posición. Finalizando turno.`);
            this.resetTurn();
        }
        
        console.log(`Estado del turno después:`, this.turnState);
    }

    showTurnMessage(message) {
        console.log(`� Mensaje al usuario: ${message}`);
        
        // Crear o actualizar elemento de mensaje
        let messageElement = document.getElementById('turn-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'turn-message';
            messageElement.className = 'turn-message';
            document.body.appendChild(messageElement);
        }
        
        messageElement.textContent = message;
        messageElement.classList.add('show');
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 3000);
    }

    checkGameStateAfterManualMove() {
        // Verificar si todas las cartas están en su posición correcta
        if (this.hasWon()) {
            console.log('¡Ganaste el juego!');
            this.endGame(true);
            return;
        }
        
        // Verificar si no hay más movimientos posibles
        if (!this.hasMovableCards() && !this.hasUnflippedCards()) {
            console.log('No hay más movimientos posibles - Game Over');
            this.gameOver();
        }
    }

    hasWon() {
        const positionNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        for (let pos of positionNames) {
            const position = this.positions[pos];
            // Debe tener exactamente 4 cartas boca arriba, todas del valor correcto
            if (position.faceUp.length !== 4) {
                return false;
            }
            // Verificar que todas las cartas tengan el valor correcto
            for (let card of position.faceUp) {
                if (card.value !== pos) {
                    return false;
                }
            }
            // No debe tener cartas boca abajo
            if (position.faceDown.length > 0) {
                return false;
            }
        }
        
        return true;
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
        console.log('=== RESETEANDO JUEGO ===');
        this.gameInProgress = false;
        this.currentPosition = 'K';
        this.draggedCard = null;
        
        // Limpiar completamente todas las posiciones
        this.initializePositions();
        
        // Crear deck fresco
        this.createDeck();
        
        // Resetear UI
        document.getElementById('start-game').disabled = false;
        document.getElementById('auto-play').disabled = true;
        
        // Limpiar tablero visual
        this.renderBoard();
        
        // Volver a pantalla de juego
        this.showScreen('game-screen');
        
        console.log('=== JUEGO RESETEADO ===');
    }

    setupEventListeners() {
        console.log('Configurando event listeners...');
        
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
        
        // Botón return-home (en pantalla de resultados)
        const returnHomeBtn = document.getElementById('return-home');
        if (returnHomeBtn) {
            returnHomeBtn.addEventListener('click', () => this.showScreen('home-screen'));
        }
        
        // Botón play
        const playBtn = document.getElementById('play-btn');
        console.log('Botón play encontrado:', playBtn);
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                console.log('Click en botón play detectado');
                this.showModeModal();
            });
        }
        
        // Modal de selección - botones manual y automático
        const manualModeBtn = document.getElementById('manual-mode');
        const autoModeBtn = document.getElementById('auto-mode');
        
        console.log('Botón manual encontrado:', manualModeBtn);
        console.log('Botón auto encontrado:', autoModeBtn);
        
        if (manualModeBtn) {
            manualModeBtn.addEventListener('click', () => {
                console.log('Click en modo manual detectado');
                const shuffle = document.querySelector('input[name="shuffle"]:checked').value;
                this.selectGameMode('manual', shuffle);
            });
        }
        
        if (autoModeBtn) {
            autoModeBtn.addEventListener('click', () => {
                console.log('Click en modo automático detectado');
                const shuffle = document.querySelector('input[name="shuffle"]:checked').value;
                this.selectGameMode('auto', shuffle);
            });
        }
        
        // Configurar drop zones para modo manual
        this.setupDropZones();
    }

    startNewGame() {
        console.log('=== INICIANDO NUEVO JUEGO ===');
        
        // Resetear estado del juego
        this.gameInProgress = false;
        this.currentPosition = 'K';
        
        // Obtener configuraciones
        const shuffleType = document.querySelector('input[name="shuffle"]:checked')?.value || 'perfect';
        console.log('Tipo de barajado seleccionado:', shuffleType);
        
        // Crear deck fresco (no duplicar)
        console.log('Creando deck fresco...');
        this.createDeck();
        
        // Barajar
        console.log('Barajando el deck...');
        this.shuffleDeck(shuffleType);
        
        // Repartir cartas
        console.log('Repartiendo cartas...');
        this.dealCards();
        
        // Iniciar el juego
        console.log('Iniciando el juego...');
        this.startGame();
        
        console.log('=== NUEVO JUEGO INICIADO ===');
    }

    selectGameMode(mode, shuffleType) {
        console.log('Seleccionando modo de juego:', mode, 'con barajado:', shuffleType);
        this.currentMode = mode;
        this.shuffleType = shuffleType;
        
        // Cerrar modal
        const modal = document.getElementById('mode-selection');
        console.log('Cerrando modal:', modal);
        if (modal) {
            modal.classList.add('hidden');
            console.log('Modal cerrado');
        }
        
        // Ir a pantalla de juego
        console.log('Cambiando a pantalla de juego...');
        this.showScreen('game-screen');
        
        // Comenzar nuevo juego
        console.log('Iniciando nuevo juego...');
        this.startNewGame();
        
        // Comenzar nuevo juego
        this.startNewGame();
    }

    showModeModal() {
        console.log('Ejecutando showModeModal...');
        const modal = document.getElementById('mode-selection');
        console.log('Modal encontrado:', modal);
        if (modal) {
            modal.classList.remove('hidden');
            console.log('Clase hidden removida del modal');
        }
    }

    showScreen(screenId) {
        console.log('Mostrando pantalla:', screenId);
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
        
        const targetScreen = document.getElementById(screenId);
        console.log('Pantalla objetivo encontrada:', targetScreen);
        if (targetScreen) {
            targetScreen.classList.add('active');
            console.log('Clase active agregada a la pantalla:', screenId);
        }
    }

    resetTurn() {
        console.log(`🔄 Reseteando turno...`);
        this.turnState = {
            canFlipCard: true,
            flippedThisTurn: false,
            lastFlippedFrom: null,
            waitingForAction: false
        };
        console.log(`✅ Turno reseteado:`, this.turnState);
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando Future Cards...');
    window.game = new FutureCardsGame();
    console.log('Juego inicializado correctamente');
});
