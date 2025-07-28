# 🃏 Future Cards - Juego de Cartas Interactivo

## 📝 Descripción

**Future Cards** es un juego de cartas estratégico e interactivo desarrollado en HTML5, CSS3 y JavaScript vanilla. El objetivo es organizar todas las cartas de una baraja estándar de 52 cartas en sus posiciones correctas siguiendo reglas específicas de turnos y secuencias.

## 🎮 Características Principales

### ✨ Funcionalidades del Juego
- **🎯 Juego por turnos secuencial** - Sistema de turnos que inicia en la posición K
- **🎨 Interfaz visual atractiva** - Diseño moderno con efectos visuales y animaciones
- **🖱️ Sistema drag & drop** - Arrastra y suelta cartas con validación en tiempo real
- **🤖 Modo automático** - IA que resuelve el juego automáticamente
- **📱 Diseño responsivo** - Compatible con dispositivos móviles y tablets
- **🔄 Sistema de reinicio** - Reinicia el juego en cualquier momento
- **⚡ Feedback instantáneo** - Mensajes visuales para cada acción

### 🎲 Mecánicas del Juego
- **Distribución inicial**: 4 cartas por posición (A-K), todas boca abajo
- **Turno secuencial**: Inicia en K, continúa según la carta colocada
- **Reglas de colocación**: Las cartas solo pueden ir a su posición correcta
- **Condición de victoria**: Todas las cartas en sus posiciones correctas

## 🚀 Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, recomendado)

### Instalación Local

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/G-A-E-C/Future-Cards.git
   cd Future-Cards
   ```

2. **Inicia un servidor local:**
   ```bash
   # Con Python 3
   python -m http.server 8080
   
   # Con Node.js (si tienes http-server instalado)
   npx http-server -p 8080
   
   # Con PHP
   php -S localhost:8080
   ```

3. **Abre en el navegador:**
   ```
   http://localhost:8080
   ```

## 🎯 Cómo Jugar

### Inicio del Juego
1. **🏠 Menú Principal**: Haz clic en "Play" desde la pantalla de inicio
2. **🎮 Iniciar Juego**: Presiona "Iniciar Juego" para comenzar
3. **📋 Tablero**: Se distribuyen 4 cartas por posición, todas boca abajo

### Reglas del Juego
1. **🔄 Turno Inicial**: El juego siempre inicia en la posición K
2. **🃏 Voltear Cartas**: Haz clic en una carta boca abajo para voltearla
3. **🎯 Colocar Cartas**: Arrastra la carta volteada a su posición correcta
4. **➡️ Siguiente Turno**: El turno pasa a la posición de la carta que acabas de colocar
5. **🎉 Victoria**: Completa cuando todas las cartas están en sus posiciones

### Controles
- **🖱️ Clic**: Voltear cartas boca abajo
- **🤏 Drag & Drop**: Mover cartas a posiciones
- **🤖 Modo Automático**: Deja que la IA resuelva el juego
- **🔄 Reiniciar**: Comenzar una nueva partida
- **🏠 Inicio**: Volver al menú principal

## 🎨 Capturas de Pantalla

### 🏠 Menú Principal
- Pantalla de inicio con título animado
- Botones de navegación con efectos hover
- Diseño responsivo para todos los dispositivos

### 🎮 Pantalla de Juego
- Tablero de 4x4 con posiciones claramente marcadas
- Cartas con animaciones suaves
- Panel de información y controles
- Feedback visual en tiempo real

### 🤖 Modo Automático
- Resolución automática paso a paso
- Controles de pausa/continuar
- Visualización del proceso de resolución

## 🛠️ Arquitectura Técnica

### 📁 Estructura de Archivos
```
Future-Cards/
├── 📄 index.html          # Página principal con menú
├── 📄 game.html           # Página del juego
├── 📂 img/                # Recursos gráficos
│   ├── 🖼️ title.png       # Título del juego
│   ├── 🖼️ Home.png        # Fondo del menú
│   ├── 🖼️ Board.png       # Fondo del tablero
│   ├── 🖼️ PlayBtm.png     # Botón de jugar
│   ├── 🖼️ Settings Btm.png # Botón de configuración
│   ├── 🖼️ Exit.png        # Botón de salir
│   └── 📂 cards/          # Imágenes de cartas (54 archivos)
└── 📄 README.md           # Documentación
```

### 🧩 Componentes Principales

#### 🎮 FutureCardsGame (Clase Principal)
- **Constructor**: Inicializa el estado del juego
- **createDeck()**: Genera la baraja de 52 cartas
- **initializePositions()**: Configura las 13 posiciones (A-K)
- **dealCards()**: Distribuye las cartas al tablero
- **setupEventListeners()**: Configura eventos de interfaz

#### 🎯 Sistema de Turnos
- **advanceTurn()**: Maneja la lógica de turnos secuenciales
- **canFlipCardInPosition()**: Valida si se puede voltear una carta
- **handleCorrectDrop()**: Procesa colocación correcta de cartas
- **handleIncorrectDrop()**: Maneja errores del usuario

#### 🤖 Modo Automático
- **startAutoMode()**: Inicia resolución automática
- **autoSolveStep()**: Ejecuta un paso de resolución
- **findAndExecuteAutoMove()**: Encuentra y ejecuta movimientos
- **autoFlipCard()**: Voltea cartas automáticamente

#### 🎨 Interfaz y Efectos
- **showMessage()**: Muestra mensajes temporales
- **showErrorMessage()**: Muestra errores con estilo especial
- **updateLocalPileCounters()**: Actualiza contadores visuales
- **checkWinCondition()**: Verifica condición de victoria

## 🔧 Configuración y Personalización

### ⚙️ Variables Configurables
```javascript
// En la clase FutureCardsGame
this.autoModeSpeed = 1000;      // Velocidad del modo automático (ms)
this.dragDropEnabled = true;    // Habilitar drag & drop
this.animationDuration = 300;   // Duración de animaciones (ms)
```

### 🎨 Personalización Visual
- **Colores**: Modificar variables CSS en los archivos HTML
- **Tamaños**: Ajustar dimensiones de cartas y tablero
- **Animaciones**: Personalizar efectos y transiciones
- **Fuentes**: Cambiar tipografías y tamaños

### 📱 Responsive Design
- **Desktop**: Tablero completo 920px
- **Tablet**: Tablero adaptado 768px
- **Mobile**: Layout optimizado 480px

## 🐛 Resolución de Problemas

### ❌ Problemas Comunes

**🚫 "Las cartas no se cargan"**
- Verificar que las imágenes estén en `/img/cards/`
- Confirmar nombres de archivos (ej: `A-C.png`, `K-S.png`)
- Revisar permisos de archivos

**🖱️ "Drag & drop no funciona"**
- Verificar que el juego esté iniciado
- Comprobar que la carta esté volteada
- Asegurar que el navegador soporte HTML5

**🤖 "Modo automático se cuelga"**
- Pausar y reanudar el modo automático
- Verificar que no haya cartas duplicadas
- Reiniciar el juego si persiste

**📱 "Problemas en móvil"**
- Usar gestos táctiles para drag & drop
- Activar modo landscape para mejor experiencia
- Verificar zoom del navegador

### 🔍 Debug Mode
Abrir Developer Tools (F12) para ver logs detallados:
```javascript
// Activar logs adicionales
console.log('Estado del juego:', game.getGameState());
console.log('Posiciones:', game.positions);
console.log('Baraja:', game.deck);
```

## 🤝 Contribución

### 🛠️ Desarrollo Local
1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Realiza cambios y commits: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

### 📋 Guidelines
- **🎯 Código limpio**: Mantener funciones pequeñas y bien documentadas
- **📝 Comentarios**: Agregar comentarios descriptivos para lógica compleja
- **🧪 Testing**: Probar en múltiples navegadores y dispositivos
- **📱 Responsive**: Asegurar compatibilidad móvil

### 🐛 Reportar Bugs
1. Verificar que el bug no esté ya reportado
2. Crear issue con pasos para reproducir
3. Incluir información del navegador y dispositivo
4. Agregar capturas de pantalla si es relevante

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

```
MIT License

Copyright (c) 2025 G-A-E-C

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Autor

**Gabriel Alejandro Espinoza Coronel (G-A-E-C)**
- GitHub: [@G-A-E-C](https://github.com/G-A-E-C)
- Proyecto: [Future-Cards](https://github.com/G-A-E-C/Future-Cards)

## 🙏 Agradecimientos

- **🎨 Diseño**: Inspirado en juegos de cartas clásicos
- **🖼️ Assets**: Imágenes de cartas de dominio público
- **💡 Conceptos**: Mecánicas de juegos de cartas tradicionales
- **🛠️ Tecnologías**: HTML5, CSS3, JavaScript ES6+

---

### 📊 Estadísticas del Proyecto

- **📅 Inicio**: Julio 2025
- **📝 Líneas de código**: ~1400+ líneas JavaScript
- **🎨 Assets**: 60+ archivos de imagen
- **🌐 Compatibilidad**: Navegadores modernos
- **📱 Responsive**: Sí
- **🤖 IA**: Modo automático incluido

---

**¿Te gusta el proyecto? ⭐ Dale una estrella en GitHub!**
