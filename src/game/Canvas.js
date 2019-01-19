
import log from 'loglevel'

export const OBJECT_PLAYER = 0
export const OBJECT_SNAKE = 1
export const OBJECT_APPLE = 2
export const OBJECT_CORPSE = 3
export const OBJECT_WATERMELON = 4
export const OBJECT_WALL = 5

const X = 0
const Y = 1

const DOT_SIZE = 15

const COLOR_PLAYER = '#900'
const COLOR_SNAKE = '#f44'
const COLOR_APPLE = '#0f0'
const COLOR_CORPSE = '#00f'
const COLOR_WATERMELON = '#ff0'
const COLOR_WALL = '#eee'

export class Canvas {
  constructor (contextSnakes, contextFood, contextWalls, contextGrid) {
    this._contextSnakes = contextSnakes
    this._contextFood = contextFood
    this._contextWalls = contextWalls
    this._contextGrid = contextGrid
  }

  clear (type, dots) {
    switch (type) {
      case OBJECT_PLAYER:
      case OBJECT_SNAKE:
        // That is the same: deleting a snake or delete the snake of a player.
        this._clear(this._contextSnakes, dots)
        break
      case OBJECT_APPLE:
      case OBJECT_CORPSE:
      case OBJECT_WATERMELON:
        // Deleting of any food is same operation.
        this._clear(this._contextFood, dots)
        break
      case OBJECT_WALL:
        this._clear(this._contextWalls, dots)
        break
      default:
        log.error('canvas clear invalid type', type)
    }
  }

  _clear (context, dots) {
    dots.forEach(dot => {
      context.clearRect(dot[X] * DOT_SIZE, dot[Y] * DOT_SIZE, DOT_SIZE, DOT_SIZE)
    })
  }

  draw (type, dots) {
    switch (type) {
      case OBJECT_PLAYER:
        this._draw(this._contextSnakes, COLOR_PLAYER, dots)
        break
      case OBJECT_SNAKE:
        this._draw(this._contextSnakes, COLOR_SNAKE, dots)
        break
      case OBJECT_APPLE:
        this._draw(this._contextFood, COLOR_APPLE, dots)
        break
      case OBJECT_CORPSE:
        this._draw(this._contextFood, COLOR_CORPSE, dots)
        break
      case OBJECT_WATERMELON:
        this._draw(this._contextFood, COLOR_WATERMELON, dots)
        break
      case OBJECT_WALL:
        this._draw(this._contextWalls, COLOR_WALL, dots)
        break
      default:
        log.error('canvas draw invalid type', type)
    }
  }

  _draw (context, color, dots) {
    context.fillStyle = color
    dots.forEach(dot => {
      context.fillRect(dot[X] * DOT_SIZE, dot[Y] * DOT_SIZE, DOT_SIZE, DOT_SIZE)
    })
  }

  clearAll () {
    this._contextSnakes.clearRect(0, 0, this._contextSnakes.canvas.width,
      this._contextSnakes.canvas.height)
    this._contextFood.clearRect(0, 0, this._contextFood.canvas.width,
      this._contextFood.canvas.height)
    this._contextWalls.clearRect(0, 0, this._contextWalls.canvas.width,
      this._contextWalls.canvas.height)
    this._contextGrid.clearRect(0, 0, this._contextGrid.canvas.width,
      this._contextGrid.canvas.height)
  }
}

export default Canvas
