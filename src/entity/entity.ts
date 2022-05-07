import { BoundingBox } from './bounding-box'
import { EventBuffer } from '../event/buffer'
import { GameContext } from '../game-context'
import { Level } from '../level/level'
import { Vec2 } from '../math'
import { TileResolverMatch } from '../tiles/tile-resolver'
import { Trait } from '../traits/trait'

export enum Side {
  top,
  bottom,
  left,
  right,
}

type TraitConstructor<T extends Trait> = new (...args: unknown[]) => T

export class Entity {
  pos = new Vec2()
  vel = new Vec2()
  size = new Vec2(16, 16)
  offset = new Vec2()
  traits = new Map<Function, Trait>()
  lifetime = 0
  sounds = new Set<string>()
  events = new EventBuffer()

  bounds = new BoundingBox(this.pos, this.size, this.offset)

  addTrait<T extends Trait>(trait: T) {
    this.traits.set(trait.constructor, trait)
    return trait
  }

  getTrait<T extends Trait>(TraitClass: TraitConstructor<T>): T | undefined {
    const trait = this.traits.get(TraitClass)
    if (trait instanceof TraitClass) {
      return trait
    }
    return
  }

  useTrait<T extends Trait>(
    TraitClass: TraitConstructor<T>,
    fn: (trait: T) => void,
  ): void {
    const trait = this.getTrait(TraitClass)
    if (trait) fn(trait)
  }

  update(gameContext: GameContext, level: Level) {
    this.traits.forEach((trait) => {
      trait.update(this, gameContext, level)
    })

    this.lifetime += gameContext.deltaTime
    this.offset = level.camera.pos
  }

  draw(_context: CanvasRenderingContext2D) {}

  finalize() {
    this.events.emit(Trait.EVENT_TASK, this)

    this.traits.forEach((trait) => {
      trait.finalize(this)
    })

    this.events.clear()
  }

  obstruct(side: Side, match: TileResolverMatch) {
    this.traits.forEach((trait) => {
      trait.obstruct(this, side, match)
    })
  }

  collides(candidate: Entity) {
    this.traits.forEach((trait) => {
      trait.collides(this, candidate)
    })
  }
}
