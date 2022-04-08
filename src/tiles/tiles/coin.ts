import { TileColliderHandler } from '../tile-collider'
import { Player } from '../../traits/player'

const handle: TileColliderHandler = ({ entity, match, resolver }) => {
  const player = entity.getTrait(Player)
  if (player) {
    resolver.matrix.delete(match.indexX, match.indexY)
    player.addCoins(1)
  }
}

export const coin = [handle, handle]
