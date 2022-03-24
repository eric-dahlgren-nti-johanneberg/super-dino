type KeyListener = (keyState: number) => void

export class Keyboard {
  /** alla knappars läge, dvs pressad eller inte */
  keyStates = new Map<String, number>()

  /** funktioner att kalla när en knapp trycks ner */
  keyListeners = new Map<String, KeyListener>()

  addListener = (keyCode: string, callback: KeyListener) => {
    this.keyListeners.set(keyCode, callback)
    this.keyStates.set(keyCode, 0)
  }

  listenTo = (target: EventTarget) => {
    /* Alla möjliga events som kan lyssnas på */
    const keyEvents = ['keydown', 'keyup']

    keyEvents.forEach((eventName) => {
      target.addEventListener(eventName, (event) => {
        this.handleEvent(event as KeyboardEvent)
      })
    })
  }

  private handleEvent = (event: KeyboardEvent) => {
    // kör endast när knappen inte auto-trycker (i.e. om jag håller nere w, behandla det inte som w-w-w-w-w-w-w-w-w utan som w-)
    if (event.repeat) return

    // vad ska hända när knappen trycks
    const listener = this.keyListeners.get(event.code)
    const keyState = event.type === 'keydown' ? 1 : 0
    if (listener) {
      // uppdatera state
      this.keyStates.set(event.code, keyState)
      // kör funktionen
      listener(keyState)
      // förhindra att webbläsaren gör något konstigt
      event.preventDefault()
    }
  }
}
