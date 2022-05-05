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

const FAST_DRAG = 1 / 5000
const SLOW_DRAG = 1 / 1000

enum SarioState {
  walking,
  crouching,
}

export class Sario extends Entity {
  go = this.addTrait(new Go())
  jump = this.addTrait(new Jump())
  // se till att sario faller och inte faller igenom block
  physics = this.addTrait(new Physics())
  solid = this.addTrait(new Solid())
  killable = this.addTrait(new Killable())

  stomper = this.addTrait(new Stomper())

  state = SarioState.walking

  constructor(private sprites: SpriteSheet, private runAnimation: Animation) {
    super()

    this.go.dragFactor = SLOW_DRAG
    this.size.set(16, 31)
    this.setTurboState(false)
  }

  resolveAnimationFrame() {
    switch (this.state) {
      case SarioState.walking:
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
      case SarioState.crouching:
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
      this.size.set(48, 16)
      this.bounds.offset.set(0, 0)
      this.state = SarioState.crouching

      this.pos.set(this.pos.x - 16, this.pos.y)
    } else {
      this.size.set(16, 31)
      this.bounds.offset.set(0, 0)
      this.pos.set(this.pos.x + 16, this.pos.y)
      this.state = SarioState.walking
    }
  }
}

export async function loadSario() {
  const [sarioSprites] = await Promise.all([loadSpriteSheet('sario')])

  const runAnimation = sarioSprites.getAnimation('run')

  return function createSario() {
    return new Sario(sarioSprites, runAnimation)
  }
}
