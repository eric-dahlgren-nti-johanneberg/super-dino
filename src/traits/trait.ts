import { Entity, Side } from '../entity/entity'
import { GameContext } from '../game-context'
import { Level } from '../level/level'
import { TileResolverMatch } from '../tiles/tile-resolver'

type TraitTask = (...args: any[]) => void

type TraitListener = {
  name: string | symbol
  callback: () => void
  count: number
}

export abstract class Trait {
  static EVENT_TASK = Symbol('task')

  private listeners: TraitListener[] = []

  protected listen(
    name: string | symbol,
    callback: () => void,
    count = Infinity,
  ) {
    this.listeners.push({ name, callback, count })
  }

  queue(task: TraitTask) {
    this.listen(Trait.EVENT_TASK, task, 1)
  }

  finalize(entity: Entity) {
    for (const listener of this.listeners) {
      entity.events.process(listener.name, listener.callback)
      listener.count -= 1
    }

    this.listeners = this.listeners.filter((listener) => listener.count > 0)
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {}
  obstruct(entity: Entity, side: Side, match: TileResolverMatch) {}
  collides(us: Entity, them: Entity) {}
}
