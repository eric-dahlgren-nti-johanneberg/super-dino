import { Level } from '../level/level'
import { Font } from '../loaders/font'
import { findPlayers } from '../player'
import { Player } from '../traits/player'

function getPlayer(level: Level) {
  for (const entity of findPlayers(level.entities)) {
    if (entity.getTrait(Player)) return entity
  }
  throw new Error('player not found')
}

export function createPlayerProgressLayer(
  font: Font,
  level: Level,
  lives: number,
) {
  const size = font.size

  return function drawPlayerProgress(context: CanvasRenderingContext2D) {
    font.print(`WORLD ${level.name}`, context, size * 12, size * 12)

    if (lives > 0) {
      new Array(lives).fill(1).forEach((_, index) => {
        font.printSpecial('heart', context, size * 13.5 + index * 16, size * 16)
      })
      new Array(3 - lives).fill(1).forEach((_, index) => {
        font.printSpecial(
          'sadheart',
          context,
          size * 13.5 + (2 - index) * 16,
          size * 16,
        )
      })
    }
  }
}
