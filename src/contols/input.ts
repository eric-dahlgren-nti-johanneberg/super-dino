import { Sario } from '../entity/entities/sario'
import { Entity } from '../entity/entity'
import { InputRouter } from './input-router'
import { Keyboard } from './keyboard'
import { Go } from '../traits/go'

export function setupKeyboard(target: EventTarget) {
  const input = new Keyboard()
  const router = new InputRouter<Entity>()

  let leftState = 0
  let rightState = 0

  input.listenTo(target)

  input.addListener('ArrowRight', (keyState) => {
    rightState = keyState
    router.route((entity) => {
      entity.useTrait(Go, (go) => {
        go.dir = rightState - leftState
      })
    })
  })

  input.addListener('ArrowLeft', (keyState) => {
    leftState = keyState
    router.route((entity) => {
      entity.useTrait(Go, (go) => {
        go.dir = rightState - leftState
      })
    })
  })

  input.addListener('KeyX', (keyState) => {
    router.route((entity) => {
      // Sario kan springa snabbt
      if (entity instanceof Sario) {
        entity.setTurboState(keyState === 1)
      }
    })
  })

  return router
}
