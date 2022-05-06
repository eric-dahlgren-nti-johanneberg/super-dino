import { Killable } from '../../traits/killable'
import { TileColliderHandler } from '../tile-collider'

const handle: TileColliderHandler = ({ entity, match }) => {
  const killable = entity.getTrait(Killable)

  if (killable) {
    killable.kill()
  }
}

export const kill = [handle, handle]
