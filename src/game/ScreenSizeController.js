
import _ from 'lodash'

const LISTEN_TO_EVENT = 'resize'
const THROTTLE_WAIT = 1000

const DEFAULT_CLIENT_WIDTH = 1200
const DEFAULT_CLIENT_HEIGHT = 800

const LINE_SIZE_MIN = 1
const LINE_SIZE_PERCENT = 0.10
const DOT_SIZE_MIN = 5
const MAP_SIZE_LIMIT_PERCENT = 0.98

const SCREEN_WIDTH_LIMIT = 600
const SCREEN_HEIGHT_LIMIT = 600

function clientSizePx () {
  return {
    width: window.innerWidth || document.documentElement.clientWidth ||
      document.body.clientWidth || DEFAULT_CLIENT_WIDTH,
    height: window.innerHeight || document.documentElement.clientHeight ||
      document.body.clientHeight || DEFAULT_CLIENT_HEIGHT
  }
}

export class ScreenSizeController {
  constructor (mapWidthDots, mapHeightDots) {
    this._mapWidthDots = mapWidthDots
    this._mapHeightDots = mapHeightDots

    this.onresize = () => {
      throw new Error('method to be triggered is not specified: onresize')
    }

    this._listener = _.throttle(() => {
      this._clientResize()
    }, THROTTLE_WAIT)
  }

  _calcMapSizePixelLimits () {
    const { width, height } = clientSizePx()

    let mapWidthPixel = 0
    let mapHeightPixel = 0

    if (width > SCREEN_WIDTH_LIMIT) {
      mapWidthPixel = Math.floor(width * MAP_SIZE_LIMIT_PERCENT)
    } else {
      mapWidthPixel = width
    }

    if (height > SCREEN_HEIGHT_LIMIT) {
      mapHeightPixel = Math.floor(height * MAP_SIZE_LIMIT_PERCENT)
    } else {
      mapHeightPixel = height
    }

    return {
      width: mapWidthPixel,
      height: mapHeightPixel
    }
  }

  gridProperties () {
    const {
      width: mapWidthPixelLimit,
      height: mapHeightPixelLimit
    } = this._calcMapSizePixelLimits()

    const cell = Math.min(
      Math.floor(mapWidthPixelLimit / this._mapWidthDots),
      Math.floor(mapHeightPixelLimit / this._mapHeightDots)
    )

    let line = Math.floor(cell * LINE_SIZE_PERCENT)
    if (line < LINE_SIZE_MIN && (cell - line) > DOT_SIZE_MIN) {
      line = LINE_SIZE_MIN
    }
    const dot = cell - line

    return {
      dot: dot,
      line: line,
      width: this._mapWidthDots,
      height: this._mapHeightDots
    }
  }

  mapProperties () {
    const { dot, line } = this.gridProperties()

    const mapWidthPixel = dot * this._mapWidthDots + line * (this._mapWidthDots + 1)
    const mapHeightPixel = dot * this._mapHeightDots + line * (this._mapHeightDots + 1)

    const { width, height } = clientSizePx()

    let x = 0
    let y = 0

    if (width > SCREEN_WIDTH_LIMIT) {
      x = Math.floor((width - mapWidthPixel) / 2)
    } else {
      x = 0
    }

    if (height > SCREEN_HEIGHT_LIMIT) {
      y = Math.floor((height - mapHeightPixel) / 2)
    } else {
      y = 0
    }

    return {
      x: x,
      y: y,
      width: mapWidthPixel,
      height: mapHeightPixel
    }
  }

  _handleResize () {
    this.onresize({
      grid: this.gridProperties(),
      map: this.mapProperties()
    })
  }

  _clientResize () {
    const { width, height } = clientSizePx()
    let flagResize = false

    if (this._clientWidthPixel !== width) {
      this._clientWidthPixel = width
      flagResize = true
    }

    if (this._clientHeightPixel !== height) {
      this._clientHeightPixel = height
      flagResize = true
    }

    if (flagResize) {
      this._handleResize()
    }
  }

  mapResize (mapWidthDots, mapHeightDots) {
    let flagResize = false

    if (this._mapWidthDots !== mapWidthDots) {
      this._mapWidthDots = mapWidthDots
      flagResize = true
    }

    if (this._mapHeightDots !== mapHeightDots) {
      this._mapHeightDots = mapHeightDots
      flagResize = true
    }

    if (flagResize) {
      this._handleResize()
    }
  }

  start () {
    window.addEventListener(LISTEN_TO_EVENT, this._listener)
  }

  stop () {
    window.removeEventListener(LISTEN_TO_EVENT, this._listener)
  }
}

export default ScreenSizeController
