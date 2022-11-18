const body = document.querySelector("body")
const playerBoard = document.querySelector(".user-board")
const enemyBoard = document.querySelector(".enemy-board")
const startButton = document.querySelector(".start-button")
const restartButton = document.querySelector(".restart-button")
const destroyerSquares = document.querySelector(".destroyer-squares")
const submarineSquares = document.querySelector(".submarine-squares")
const cruiserSquares = document.querySelector(".cruiser-squares")
const battleshipSquares = document.querySelector(".battleship-squares")
const carrierSquares = document.querySelector(".carrier-squares")
const shipContainer = document.querySelector(".ship-container")
const rotateButton = document.querySelector(".rotate")
const rotateBtnContainer = document.querySelector(".rotate-container")
const message = document.createElement("div")

const width = 10
const playerGrid = []
const playerHits = {}
const computerGrid = []
const computerHits = {}
const horizontalBoundary = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99]
const verticalBoundary = [90, 91, 92, 93, 94, 95, 96, 97, 98, 99]

let startGame = false
let isHorizontal = true
let dragData
let playerTotalHits = 0
let computerTotalHits = 0

startButton.disabled = true

const ships = [
  {
    name: "destroyer",
    dir: [0, 1],
  },
  {
    name: "submarine",
    dir: [0, 1, 2],
  },
  {
    name: "cruiser",
    dir: [0, 1, 2],
  },
  {
    name: "battleship",
    dir: [0, 1, 2, 3],
  },
  {
    name: "carrier",
    dir: [0, 1, 2, 3, 4],
  },
]

const createBoard = (grid, board) => {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div")
    square.id = i
    square.classList = "squares"
    board.appendChild(square)
    grid.push(square)
  }
}

const createUserShips = (ships) => {
  for (let i = 0; i < ships.length; i++) {
    for (let j = 0; j < ships[i].dir.length; j++) {
      const shipSquare = document.createElement("div")
      shipSquare.id = j
      shipSquare.classList = "ship-square"
      shipSquare.ship = ships[i].name
      shipContainer.children[i].appendChild(shipSquare)
    }
  }
}

const createComputerShip = (ship) => {
  const randomStartIndex = Math.floor(Math.random() * computerGrid.length)
  const randomOrientation = Math.random() < 0.5 ? 1 : 10
  const checkBottomBoundary = ship.dir.some(index => (randomStartIndex + (index * randomOrientation)) > 99)
  
  let checkRightBoundary
  let checkIfShipSquare
  
  if (randomStartIndex % width === 0) {
    checkRightBoundary = false
  } else {
    checkRightBoundary = ship.dir.some(index => (randomStartIndex + index) % width === 0)
  }

  if (!checkBottomBoundary && !checkRightBoundary) {
    checkIfShipSquare = ship.dir.some(index => computerGrid[randomStartIndex + (index * randomOrientation)].className.includes("computer-ship"))
  }

  if (!checkBottomBoundary && !checkRightBoundary && !checkIfShipSquare) {
    for (index of ship.dir) {
      computerGrid[randomStartIndex + (index * randomOrientation)].classList = "computer-ship squares"
      computerGrid[randomStartIndex + (index * randomOrientation)].ship = ship.name
    }
  } else createComputerShip(ship)
}
const createGameElements = () => {
  createBoard(computerGrid, enemyBoard)
  createBoard(playerGrid, playerBoard)
  createUserShips(ships)
  createComputerShip(ships[0])
  createComputerShip(ships[1])
  createComputerShip(ships[2])
  createComputerShip(ships[3])
  createComputerShip(ships[4])
}

createGameElements()

const hitCounter = (targetPlayer, targetShip) => {
  if (targetPlayer === "Computer") {
    if (!computerHits[targetShip]) {
      computerHits[targetShip] = 1
    } else computerHits[targetShip] += 1

    if (targetShip === "destroyer" && computerHits.destroyer === 2) {
      messageOnTimer(targetPlayer, targetShip)
    } else if (targetShip === "submarine" && computerHits.submarine === 3) {
      messageOnTimer(targetPlayer, targetShip)
    } else if (targetShip === "cruiser" && computerHits.cruiser === 3) {
      messageOnTimer(targetPlayer, targetShip)
    } else if (targetShip === "battleship" && computerHits.battleship === 4) {
      messageOnTimer(targetPlayer, targetShip)
    } else if (targetShip === "carrier" && computerHits.carrier === 5) {
      messageOnTimer(targetPlayer, targetShip)
    }
    computerTotalHits += 1
  } else {
    if (!playerHits[targetShip]) {
      playerHits[targetShip] = 1
    } else playerHits[targetShip] += 1

    if (targetShip === "destroyer" && playerHits.destroyer === 2) {
      messageOnTimer(targetPlayer, targetShip)
    } else if (targetShip === "submarine" && playerHits.submarine === 3) {
      messageOnTimer(targetPlayer, targetShip)
    } else if (targetShip === "cruiser" && playerHits.cruiser === 3) {
      messageOnTimer(targetPlayer, targetShip)
    } else if (targetShip === "battleship" && playerHits.battleship === 4) {
      messageOnTimer(targetPlayer, targetShip)
    } else if (targetShip === "carrier" && playerHits.carrier === 5) {
      messageOnTimer(targetPlayer, targetShip)
    }
    playerTotalHits += 1
  }
}

const messageOnTimer = (targetPlayer, targetShip) => {
  const otherPlayer = targetPlayer === "Player" ? "Computer" : "You"
  if (computerTotalHits === 16 || playerTotalHits === 16) {
    message.innerHTML = `${otherPlayer} sank all ${targetPlayer === "Computer" ? "computer's" : "your"} ships<br><br>${targetPlayer} lost!`
    message.classList = "ingame-messages"
    body.appendChild(message)
  } else {
    message.textContent = `${otherPlayer} sank ${targetPlayer}'s ${targetShip}`
    message.classList = "ingame-messages"
    body.appendChild(message)
    setTimeout(() => message.classList = "hidden", 3000)
  }
}

const shootComputerShip = (e) => {
  if (startGame && computerTotalHits <= 16 && playerTotalHits <= 16 && e.target.className.includes("squares")) {
    const checkForCircles = e.target.children.length
    const targetClass = e.target.className
    const circle = document.createElement("div")
    if (checkForCircles === 0 && targetClass === "squares") {
      circle.classList = "circle black"
      e.target.classList = "no-hover"
      e.target.appendChild(circle)
    } else if (checkForCircles === 0 && targetClass === "computer-ship squares") {
      e.target.classList = "computer-ship no-hover"
      circle.classList = "circle red"
      e.target.appendChild(circle)
      hitCounter("Computer", e.target.ship)
    }
    enemyBoard.removeEventListener("click", shootComputerShip)
    setTimeout(() => shootPlayerShip(), 1000)
  }
} 

enemyBoard.addEventListener("click", shootComputerShip)

shootPlayerShip = () => {
  if (computerTotalHits <= 16 && playerTotalHits <= 16) {
    const randomIndex = Math.floor(Math.random() * playerGrid.length)
    const checkIfEmpty = playerGrid[randomIndex].children.length
    const target = playerGrid[randomIndex]
    let targetShip
    const circle = document.createElement("div")
    if (checkIfEmpty === 0) {
      circle.classList = "circle black"
      target.appendChild(circle)
    } else {
      if(target.firstChild.children.length === 0 && !target.firstChild.className.includes("circle")) {
        targetShip = target.shipname
        circle.classList = "circle red"
        target.classList = target.className
        target.firstChild.appendChild(circle)
        hitCounter("Player", targetShip)

      } else {
        shootPlayerShip()
      }
    }
  }
  enemyBoard.addEventListener("click", shootComputerShip)
}

const rotateShips = (e) => {
  for (const ship of shipContainer.children) {
    const classNameSplit = ship.className.split("-")
    const shipName = classNameSplit[0]
    if (ship.className.includes("-vertical")) {
      ship.classList = shipName+"-squares ship-h"
    } else {
      ship.classList = shipName+"-squares-vertical ship-v"
    }
  }
  isHorizontal = !isHorizontal
}

rotateButton.addEventListener("click", rotateShips)

const dragStart = (e) => {
  e.target.classList.add("dragging")
  e.dataTransfer.setData("text/plain", [
    e.target.className,
    e.target.lastChild.id,
  ])
}
const dragEnd = (e) => {
  e.target.classList.remove("dragging")
  if (e.dataTransfer.dropEffect !== "none") {
    e.target.remove()
    if (shipContainer.children.length === 0) {
      body.removeChild(shipContainer)
      body.removeChild(rotateBtnContainer)
      startButton.disabled = false
    }
  }
  return
}

const checkHorizontalCollision = (
  shipCollisionArray,
  shipLastIndex,
  closestBoundary,
  event
  ) => {
    if (shipLastIndex > closestBoundary) event.dataTransfer.dropEffect = "none"
    for (square of shipCollisionArray) {
    for (child of square.children) {
      if (child.className === "ship-square") {
        event.dataTransfer.dropEffect = "none"
      }
    }
  }
}

const checkVerticalCollision = (
  shipCollisionArrayVertical,
  shipFirstIndex,
  event
  ) => {
    for (let i = 0; i <= Number(dragData.slice(-1)); i++) {
      shipCollisionArrayVertical
        .push(playerGrid
        .slice(shipFirstIndex, shipFirstIndex + 1))
        shipFirstIndex += 10
    }
    for (square of shipCollisionArrayVertical) {
      for (element of square) {
        for (child of element.children) {
          if (child.className === "ship-square") {
            event.dataTransfer.dropEffect = "none"
          }
        }
      }
    }
  }
        

const dragOver = (e) => {
  e.preventDefault()
  dragData = e.dataTransfer.getData("text/plain")
  const shipLastIndex = Number(e.target.id) + Number(dragData.slice(-1))
  const shipLastIndexVertical = Number(e.target.id) + 10 * Number(dragData.slice(-1))
  const shipFirstIndex = Number(e.target.id)
  let closestBoundary = horizontalBoundary.find((num) => num > shipFirstIndex - 1)
  let shipCollisionArray = playerGrid
    .slice(shipFirstIndex)
    .filter((square) => Number(square.id) <= shipLastIndex)
  let shipCollisionArrayVertical = []

  if (e.target.className.includes("ship")) e.dataTransfer.dropEffect = "none"

  if (isHorizontal) {
    checkHorizontalCollision(
      shipCollisionArray,
      shipLastIndex,
      closestBoundary,
      e
    )
  } else {
    checkVerticalCollision(
      shipCollisionArrayVertical,
      shipFirstIndex,
      e
    )
    if (shipLastIndexVertical > 99) e.dataTransfer.dropEffect = "none"
  }
}

const dragDrop = (e) => {
  e.preventDefault()
  const dragDataArray = dragData.split(",")
  const indexOfDragging = dragDataArray[0].indexOf("dragging") - 1
  const draggedClassName = dragDataArray[0].slice(0, indexOfDragging)
  const droppedShipLength = Number(dragDataArray[1])

  let dropTargetId = Number(e.target.id)
  let targetDiv

  if (isHorizontal) {
    addShipSquare(
      isHorizontal,
      targetDiv,
      draggedClassName,
      droppedShipLength,
      dropTargetId
    )
  } else {
    addShipSquare(
      isHorizontal,
      targetDiv,
      draggedClassName,
      droppedShipLength,
      dropTargetId
    )
  }
  e.target.classList = draggedClassName
}

const addShipSquare = (
  isHorizontal,
  targetDiv,
  draggedClassName,
  droppedShipLength,
  dropTargetId
) => {
  let getShipName = draggedClassName.split("-")
  for (let i = 0; i <= droppedShipLength; i++) {
    targetDiv = playerGrid[dropTargetId]
    if (draggedClassName.includes("destroyer")) {
      targetDiv.appendChild(destroyerSquares.firstChild)
    } else if (draggedClassName.includes("submarine")) {
      targetDiv.appendChild(submarineSquares.firstChild)
    } else if (draggedClassName.includes("cruiser")) {
      targetDiv.appendChild(cruiserSquares.firstChild)
    } else if (draggedClassName.includes("battleship")) {
      targetDiv.appendChild(battleshipSquares.firstChild)
    } else if (draggedClassName.includes("carrier")) {
      targetDiv.appendChild(carrierSquares.firstChild)
    }
    targetDiv.classList = "no-hover"
    targetDiv.shipname = getShipName[0]
    targetDiv.style.border = "none"
    isHorizontal ? dropTargetId++ : (dropTargetId += 10)
  }
}

const assignDragEventListeners = () => {
  for (let ship of shipContainer.children) {
    ship.addEventListener("dragstart", dragStart)
    ship.addEventListener("dragend", dragEnd)
  }
  playerGrid.forEach((element) => {
    element.addEventListener("dragenter", (e) => e.preventDefault())
    element.addEventListener("dragover", dragOver)
    element.addEventListener("drop", dragDrop)
  })
}
assignDragEventListeners()

restartButton.addEventListener("click", () => location.reload())

const start = (e) => {
  startGame = true
  message.innerHTML = "Game Started<br><br>Good luck!"
  message.classList = "ingame-messages"
  body.appendChild(message)
  startButton.disabled = true
  setTimeout(() => message.classList = "hidden", 5000)
}

startButton.addEventListener("click", start)