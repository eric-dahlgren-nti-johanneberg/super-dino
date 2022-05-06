import { TileColliderHandler } from '../tile-collider'

export const GAME_WON = Symbol('won')

const handle: TileColliderHandler = ({ entity, level }) => {
  setTimeout(() => {
    level.events.emit(GAME_WON)
  }, 150)
}

export const flag = [handle, handle]
