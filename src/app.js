// import Game from "./classGame";

const customCursor = document.createElement("div");
customCursor.classList.add("custom-cursor");
document.body.appendChild(customCursor);

// Обработчик события для отслеживания положения курсора мыши
document.addEventListener("mousemove", (e) => {
  customCursor.style.left = `${e.pageX}px`;
  customCursor.style.top = `${e.pageY}px`;
});
class Hole {
  constructor(index, game) {
    this.holeElement = document.getElementById(`hole${index}`);
    this.isOccupied = false;
    this.isClicked = false; // Флаг для определения, был ли клик на гоблина или пропущен
    this.game = game;
    this.goblinElement = document.createElement("div");
    this.goblinElement.classList.add("goblin");
    this.holeElement.addEventListener("click", this.onClick.bind(this));
  }

  onClick() {
    if (this.isOccupied && !this.isClicked) {
      this.isOccupied = false;
      this.holeElement.classList.remove("occupied");
      this.isClicked = true; // Устанавливаем флаг, что гоблин был кликнут
      this.game.addScore();
      this.game.updateScore();
    }
  }

  addGoblin() {
    this.isOccupied = true;
    this.isClicked = false; // Сбрасываем флаг перед добавлением гоблина
    this.holeElement.classList.add("occupied");
    this.holeElement.appendChild(this.goblinElement);
  }

  removeGoblin() {
    this.isOccupied = false;
    this.holeElement.classList.remove("occupied");
    this.goblinElement.remove();
  }
}

class Game {
  constructor(boardsize) {
    this.boardsize = boardsize;
    this.score = 0;
    this.missedGoblins = 0;
    this.holes = [];
    this.activeHoleIndex = null;
    this.wrapper = document.querySelector(".wrapper");

    for (let i = 0; i < this.boardsize ** 2; i += 1) {
      this.holes.push(new Hole(i, this));
    }
    this.updateScore();
    this.updateMissedGoblins();
  }

  addScore() {
    this.score += 1;
  }

  updateScore() {
    document.querySelector(".score").innerText = `Счет: ${this.score}`;
  }

  updateMissedGoblins() {
    document.querySelector(".missed").innerText = `Пропущенные гоблины: ${this.missedGoblins}`;
  }

  startGame() {
    this.gameInterval = setInterval(() => {
      this.moveGoblin();
    }, 1000);
  }

  stopGame() {
    clearInterval(this.gameInterval);
    this.wrapper.innerHTML = `<h1>Игра окончена </h1><br><h1> - Вы пропустили: ${this.missedGoblins} гоблинов </h1><h1> - Итоговый счет: ${this.score}</h1>`;
  }

  moveGoblin() {
    if (this.activeHoleIndex !== null) {
      this.holes[this.activeHoleIndex].removeGoblin();
      if (!this.holes[this.activeHoleIndex].isClicked) {
        this.missedGoblins += 1; // Увеличиваем счетчик пропущенных гоблинов, если гоблин не был кликнут
        this.updateMissedGoblins(); // Обновляем отображение счетчика пропущенных гоблинов
      }
    }

    let newHoleIndex;
    do {
      newHoleIndex = Math.floor(Math.random() * this.holes.length);
    } while (newHoleIndex === this.activeHoleIndex);

    this.activeHoleIndex = newHoleIndex;
    this.holes[this.activeHoleIndex].addGoblin();

    if (this.missedGoblins >= 5) {
      this.stopGame(); // Если пропустили 5 гоблинов, останавливаем игру
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game(4); // boardsize = 4
  game.startGame();
});
