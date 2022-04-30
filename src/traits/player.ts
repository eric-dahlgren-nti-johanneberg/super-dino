import { Entity } from '../entity/entity'
import { Trait } from './trait'

/* 
   Hur länge ska coins leva på marken, innan de försvinner. 
   Förhindrar att coins plockas upp efter de försvinner
 */
const COIN_LIFE_THRESHOLD = 100

export class Player extends Trait {
  name = 'UNNAMED'
  coins = 0
  lives = 3
  score = 0

  constructor() {
    super()
  }

  addCoins(count: number) {
    this.coins += count
    this.score += 100
    while (this.coins >= COIN_LIFE_THRESHOLD) {
      this.addLives(1)
      this.coins -= COIN_LIFE_THRESHOLD
    }

    this.queue((entity: Entity) => entity.sounds.add('coin'))
  }

  addLives(count: number) {
    this.lives += count
  }
}
