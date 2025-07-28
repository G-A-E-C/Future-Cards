# Future Cards - Juego de Cartas Narrativo

## 🎮 Descripción
Future Cards es un juego de cartas narrativo con estilo visual de 16 bits que utiliza una lógica especial de destino para determinar predicciones. El juego implementa reglas únicas donde cada carta debe encontrar su posición destino según su valor.

## 🎯 Características Principales

### ✨ Interfaz de Usuario
- **Estilo 16 bits retro** con sprites pixelados
- **Navegación intuitiva** entre pantallas
- **Animaciones fluidas** para volteo y movimiento de cartas
- **Diseño responsivo** que se adapta a diferentes tamaños de pantalla

### 🃏 Mecánicas de Juego

#### 📋 Reglas del Juego
1. **Inicio**: Se voltea una carta desde la posición "K"
2. **Movimiento**: La carta se mueve al final de la pila de su valor correspondiente (ej: un "6" va a la posición "6")
3. **Continuación**: Se voltea la siguiente carta no revelada en la posición donde se colocó
4. **Repetición**: El proceso continúa hasta que no haya más cartas en la posición actual
5. **Resultado**:
   - **"SÍ"**: Si todas las pilas están vacías cuando "K" termina
   - **"NO"**: Si la pila "K" queda vacía pero hay otras pilas con cartas sin voltear

#### 🎲 Sistema de Barajado
- **Barajado Perfecto (Riffle Shuffle)**: Simula el barajado profesional dividiendo el mazo en dos y entrelazando las cartas
- **Barajado Imperfecto**: Mezcla completamente aleatoria para mayor variabilidad

#### 🎮 Modos de Juego
- **Manual**: El jugador arrastra las cartas a sus posiciones destino
- **Automático**: El sistema mueve las cartas automáticamente con animaciones

## 📐 Disposición del Tablero

```
[A]  [2]  [3]  [4]
[Q]    [K]     [5]
[J]           [6]
[10] [9] [8] [7]
```

Cada posición contiene 4 cartas inicialmente, todas boca abajo.

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere instalación de software adicional

### Ejecución
1. Navega al directorio del proyecto
2. Abre `index.html` en tu navegador web
3. ¡Disfruta del juego!

## 🎨 Estructura del Proyecto

```
Future-Cards/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS con temática 16-bits
├── script.js           # Lógica del juego en JavaScript
├── img/
│   ├── Board.png       # Fondo del tablero de juego
│   ├── Home.png        # Fondo de la pantalla principal
│   ├── PlayBtm.png     # Botón de jugar
│   ├── Settings Btm.png # Botón de configuración
│   ├── Exit.png        # Botón de salir
│   └── cards/          # Sprites de todas las cartas
│       ├── A-C.png     # As de Tréboles
│       ├── 2-H.png     # 2 de Corazones
│       ├── ...         # (52 cartas completas)
│       └── Backcard.png # Reverso de las cartas
```

## 🔧 Características Técnicas

### 💻 Tecnologías Utilizadas
- **HTML5**: Estructura semántica del juego
- **CSS3**: Animaciones, transiciones y diseño responsivo
- **JavaScript Vanilla**: Lógica del juego sin dependencias externas
- **Drag & Drop API**: Para el modo manual de juego

### 🎨 Características de Diseño
- **Image Rendering**: Optimizado para sprites pixelados
- **Animaciones CSS**: Efectos de volteo, movimiento y hover
- **Grid Layout**: Disposición precisa del tablero
- **Flexbox**: Alineación flexible de elementos UI

### 📱 Compatibilidad
- **Desktop**: Funcionalidad completa con drag & drop
- **Tablet**: Adaptado para pantallas táctiles
- **Mobile**: Diseño responsivo optimizado

## 🎯 Próximas Características

- [ ] Sistema de puntuación
- [ ] Estadísticas de partidas
- [ ] Diferentes mazos temáticos
- [ ] Sonidos y efectos de audio
- [ ] Modo multijugador
- [ ] Configuraciones avanzadas

## 🤝 Contribución

Este proyecto está abierto a contribuciones. Para colaborar:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Realiza tus cambios y haz commit (`git commit -am 'Agrega nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## 🎮 ¡Disfruta el Juego!

Future Cards combina la nostalgia de los juegos retro con mecánicas innovadoras de cartas. Cada partida es única y el destino siempre tiene la última palabra.

---

*Desarrollado con ❤️ para los amantes de los juegos de cartas y la estética retro.*
