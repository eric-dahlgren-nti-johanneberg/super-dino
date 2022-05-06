import { loadImage } from './image'
import { SpriteSheet } from '../sprite-sheet'

const characters =
  ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'

export class Font {
  constructor(
    private sprites: SpriteSheet,
    public special: SpriteSheet,
    public size: number,
  ) {}

  printSpecial(
    sprite: string,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
  ) {
    this.special.draw(sprite, context, x, y)
  }

  print(text: string, context: CanvasRenderingContext2D, x: number, y: number) {
    for (const [pos, char] of [...text].entries()) {
      context.save()
      this.sprites.draw(char, context, x + pos * this.size, y)
      context.restore()
    }
  }
}

export async function loadFont() {
  const [fontImage, spriteImage] = await Promise.all([
    loadImage('images/font.png'),
    loadImage('images/tiles.png'),
  ])
  const fontSprite = new SpriteSheet(fontImage, 8, 8)
  const specialSprite = new SpriteSheet(spriteImage, 16, 16)

  const size = 8
  const rowLen = fontImage.width

  for (const [index, char] of [...characters].entries()) {
    const x = (index * size) % rowLen
    const y = Math.floor((index * size) / rowLen) * size
    fontSprite.definera(char, x, y, size, size)
  }

  specialSprite.definera('heart', 0, 80, 16, 16)
  specialSprite.definera('sadheart', 16, 80, 16, 16)

  return new Font(fontSprite, specialSprite, 8)
}
