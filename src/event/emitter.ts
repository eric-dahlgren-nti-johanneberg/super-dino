type Callback = (...args: any[]) => void
type Listener = { name: string | symbol; callback: Callback }

/** 
 *  Lite som buffer, men för att lyssna på events istället för att skicka ut dem  
 */
export class EventEmitter {
  private listeners: Listener[] = []

  listen(name: string | symbol, callback: Callback) {
    this.listeners.push({ name, callback })
  }

  emit(name: string | symbol, ...args: any[]) {
    this.listeners
      .filter((it) => it.name === name)
      .forEach((it) => it.callback(...args))
  }
}
