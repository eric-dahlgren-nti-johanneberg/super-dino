import { setupKeyboard } from './contols/input'
import { loadEntities } from './entity/entities'
import { GameContext } from './game-context'
import { createTextLayer } from './layers/color'
import { createColorLayer } from './layers/text'
import { createCollisionLayer } from './layers/collision'
import { Scene } from './level/scene'
import { SceneRunner } from './level/scene-runner'
import { loadFont } from './loaders/font'
import { createLevelLoader } from './loaders/level'
import { createPlayerEnv, findPlayers, makePlayer } from './player'
import { raise } from './raise'
import { Timer } from './timer'
import { Level } from './level/level'
import { LevelSpecTrigger } from './loaders'
import { Entity } from './entity/entity'
import { Player } from './traits/player'
// import { createCameraLayer } from './layers/camera'
import { createScoreLayer } from './layers/score'
import { PlayerController } from './traits/player-controller'
import { createProgressScreen } from './screens/wait-screen'
import { GAME_WON } from './tiles/tiles/flag'

const main = async (canvas: HTMLCanvasElement): Promise<void> => {
  const context = canvas.getContext('2d') || raise('Canvas not supported')
  // slipp skriva `Math#floor` en massa gånger
  context.imageSmoothingEnabled = false

  const [entityFactory, font] = await Promise.all([loadEntities(), loadFont()])

  const loadLevel = createLevelLoader(entityFactory)

  const sceneRunner = new SceneRunner()

  const sario = entityFactory.sario?.() || raise('no sario found')
  makePlayer(sario, 'Dino')

  const inputRouter = setupKeyboard(window)
  inputRouter.addReceiver(sario)

  async function runLevel(name: string) {
    const loadScreen = new Scene()
    loadScreen.comp.layers.push(createColorLayer('black'))
    loadScreen.comp.layers.push(createTextLayer(font, `LOADING ${name}...`))
    sceneRunner.addScene(loadScreen)
    sceneRunner.runNext()

    await new Promise((resolve) => setTimeout(resolve, 500))

    const level = await loadLevel(name)

    level.events.listen(
      Level.EVENT_TRIGGER,
      (spec: LevelSpecTrigger, trigger: Entity, touches: Set<Entity>) => {
        if (spec.type === 'goto') {
          for (const entity of touches) {
            if (entity.getTrait(Player)) {
              runLevel(spec.name)
              return
            }
          }
        }
      },
    )

    const scoreLayer = createScoreLayer(font, level)

    level.entities.add(sario)

    const playerEnv = createPlayerEnv(sario)

    level.entities.add(playerEnv)

    const progress = createProgressScreen(
      font,
      level,
      sario.getTrait(Player)?.lives || 0,
    )
    sceneRunner.addScene(progress)

    level.comp.layers.push(scoreLayer)

    // DEBUG
    // level.comp.layers.push(createCollisionLayer(level)) // collision boxes
    // level.comp.layers.push(createCameraLayer(level.camera)) // camera position

    sceneRunner.addScene(level)
    sceneRunner.runNext()

    sario.events.process('win', () => console.log('win!'))

    level.events.listen(PlayerController.KILLED, async () => {
      const player = sario.getTrait(Player)
      if (player) {
        player.addLives(-1)
        if (player.lives < 1) {
          const gameOverScreen = new Scene()

          gameOverScreen.comp.layers.push(createColorLayer('black'))
          gameOverScreen.comp.layers.push(
            createTextLayer(font, `GAME OVER`, 'CTRL + R TO RESTART'),
          )
          sceneRunner.addScene(gameOverScreen)
          sceneRunner.runNext()
        }
      }
    })

    level.events.listen(PlayerController.REVIVED, async () => {
      const player = sario.getTrait(Player)

      if (player?.lives) {
        const progress = createProgressScreen(font, level, player.lives)
        sceneRunner.addScene(progress)
        sceneRunner.addScene(level)
        sceneRunner.runNext()
      }
    })

    level.events.listen(GAME_WON, () => {
      const gameOverScreen = new Scene()

      gameOverScreen.comp.layers.push(createColorLayer('black'))
      gameOverScreen.comp.layers.push(
        createTextLayer(font, `YOU WIN!`, 'CTRL + R TO RESTART'),
      )
      sceneRunner.addScene(gameOverScreen)
      sceneRunner.runNext()
    })
  }

  const timer = new Timer()

  timer.update = function update(deltaTime) {
    if (!document.hasFocus()) return

    const gameContext: GameContext = {
      deltaTime,
      entityFactory,
      graphicsContext: context,
    }

    sceneRunner.update(gameContext)
  }

  timer.start()

  runLevel('1-1')
}

const canvas = document.getElementById('screen')
if (canvas instanceof HTMLCanvasElement) {
  main(canvas).catch(console.error)
} else {
  console.warn('Canvas not found')
}
