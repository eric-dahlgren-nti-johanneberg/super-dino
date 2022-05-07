import { Level } from '../level/level'
import { Font } from '../loaders/font'
import { findPlayers } from '../player'
import { LevelTimer } from '../traits/level-timer'
import { Player } from '../traits/player'

function getPlayerTrait(level: Level) {
  for (const entity of findPlayers(level.entities)) {
    const trait = entity.getTrait(Player)
    if (trait) return trait
  }
}

function getTimerTrait(level: Level) {
  for (const entity of level.entities) {
    const trait = entity.getTrait(LevelTimer)
    if (trait) return trait
  }
}

export function createScoreLayer(font: Font, level: Level) {
  const line1 = font.size
  const line2 = font.size * 2

  return function drawScore(context: CanvasRenderingContext2D) {
    const player = getPlayerTrait(level)
    if (player) {
      font.print(player.name, context, 16, line1)
      font.print(String(player.score).padStart(4, '0'), context, 16, line2)

      font.print(
        '@x' + String(player.coins).padStart(2, '0'),
        context,
        60,
        line2,
      )

      if (player.lives > 0) {
        new Array(player.lives).fill(1).forEach((_, index) => {
          font.printSpecial('heart', context, 180 + index * 16, line1)
        })
        new Array(3 - player.lives).fill(1).forEach((_, index) => {
          font.printSpecial('sadheart', context, 180 + (2 - index) * 16, line1)
        })
      }
    }

    const timer = getTimerTrait(level)

    if (timer) {
      font.print('TIME', context, 120, line1)
      font.print(
        String(Math.floor(timer.currentTime)).padStart(3, '0'),
        context,
        120,
        line2,
      )
    }
  }
}
