import { TileColliderHandler } from '../tile-collider'
import { Player } from '../../traits/player'

const handle: TileColliderHandler = ({ entity, match, resolver, level }) => {
  const player = entity.getTrait(Player)
  if (player) {
    resolver.matrix.delete(match.indexX, match.indexY)
  }
}

export const checkpoint = [handle, handle]
