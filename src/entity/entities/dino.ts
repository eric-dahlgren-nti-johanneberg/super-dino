import { Entity } from '../entity'
import { loadSpriteSheet } from '../../loaders/sprite'
import { SpriteSheet } from '../../sprite-sheet'
import { Go } from '../../traits/go'
import { Jump } from '../../traits/jump'
import { Physics } from '../../traits/physics'
import { Solid } from '../../traits/solid'
import { Animation } from '../../animation'
import { Stomper } from '../../traits/stomper'
import { Killable } from '../../traits/killable'
import { Trait } from '../../traits/trait'
import { GameContext } from '../../game-context'
import { Level } from '../../level/level'

const FAST_DRAG = 1 / 5000
const SLOW_DRAG = 1 / 1000

enum DinoState {
  walking,
  crouching,
}

class DinoBehaviour extends Trait {
  update(dino: Dino, gameContext: GameContext, level: Level): void {
    if (dino.won) {
      level.events.emit(Symbol('won'))
    }
  }
}

export class Dino extends Entity {
  go = this.addTrait(new Go())
  jump = this.addTrait(new Jump())
  // se till att Dino faller och inte faller igenom block
  physics = this.addTrait(new Physics())
  solid = this.addTrait(new Solid())

  killable = this.addTrait(new Killable())
  stomper = this.addTrait(new Stomper())

  winnable = this.addTrait(new DinoBehaviour())

  state = DinoState.walking
  won = false

  constructor(private sprites: SpriteSheet, private runAnimation: Animation) {
    super()

    this.killable.removeAfter = 0
    this.go.dragFactor = SLOW_DRAG
    this.size.set(16, 31)
    this.setTurboState(false)
  }

  resolveAnimationFrame() {
    switch (this.state) {
      case DinoState.walking:
        if (this.go.distance > 0) {
          /*  if (
            (this.vel.x > 0 && this.go.dir < 0) ||
            (this.vel.x < 0 && this.go.dir > 0)
          ) {
            return 'brake'
          } */

          return this.runAnimation(this.go.distance)
        }

        break
      case DinoState.crouching:
        return 'crouch'
    }

    return 'idle'
  }

  draw(context: CanvasRenderingContext2D) {
    this.sprites.draw(
      this.resolveAnimationFrame(),
      context,
      0,
      0,
      this.go.heading < 0,
    )
  }

  setTurboState(turboState: boolean) {
    this.go.dragFactor = turboState ? FAST_DRAG : SLOW_DRAG
  }

  setCrouching(crouching: boolean) {
    if (crouching) {
      this.size.set(16, 16)
      this.offset.set(16, 0)
      this.state = DinoState.crouching
    } else {
      this.offset.set(0, 0)
      this.size.set(16, 31)
      this.state = DinoState.walking
    }
  }
}

export async function loadDino() {
  const [DinoSprites] = await Promise.all([loadSpriteSheet('dino')])

  const runAnimation = DinoSprites.getAnimation('run')

  return function createDino() {
    return new Dino(DinoSprites, runAnimation)
  }
}
