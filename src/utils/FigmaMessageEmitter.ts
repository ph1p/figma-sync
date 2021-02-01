/**
 * An structured way to handle renderer and main messages
 */
class FigmaMessageEmitter {
  messageEvent = new Map();
  send: (name: string, data?: object | number | string | Uint8Array) => void;

  constructor() {
    // MAIN PROCESS
    try {
      this.send = (name = '', data) => {
        figma.ui.postMessage({
          name,
          data: data || null,
        });
      };

      figma.ui.onmessage = (event) => {
        if (this.messageEvent.has(event.name)) {
          this.messageEvent.get(event.name)(event.data, this.send);
        }
      };
    } catch {
      // we ignore the error, because it only says, that "figma" is undefined
      // RENDERER PROCESS
      onmessage = (event) => {
        if (this.messageEvent.has(event.data.pluginMessage.name)) {
          this.messageEvent.get(event.data.pluginMessage.name)(
            event.data.pluginMessage.data,
            this.send
          );
        }
      };

      this.send = (name = '', data = {}) =>
        parent.postMessage(
          {
            pluginMessage: {
              name,
              data: data || null,
            },
          },
          '*'
        );
    }
  }

  /**
   * This method sends a message to main or renderer
   * @param name string
   * @param callback function
   */
  on(name, callback) {
    this.messageEvent.set(name, callback);

    return () => this.removeListener(name);
  }

  /**
   * Listen to a message once
   * @param name
   * @param callback
   */
  once(name, callback) {
    const remove = this.on(name, (data, send) => {
      callback(data, send);
      remove();
    });
  }

  /**
   * Ask for data
   * @param name
   */
  ask(name, data = undefined) {
    this.send(name, data);

    return new Promise((resolve) => this.once(name, resolve));
  }

  /**
   * Answer data from "ask"
   * @param name
   * @param functionOrValue
   */
  answer(name, functionOrValue) {
    this.on(name, (incomingData, send) => {
      if (this.isAsyncFunction(functionOrValue)) {
        functionOrValue(incomingData).then((data) => send(name, data));
      } else if (typeof functionOrValue === 'function') {
        send(name, functionOrValue(incomingData));
      } else {
        send(name, functionOrValue);
      }
    });
  }

  /**
   * Remove and active listener
   * @param name
   */
  removeListener(name) {
    if (this.messageEvent.has(name)) {
      this.messageEvent.delete(name);
    }
  }

  /**
   * This function checks if it is asynchronous or not
   * @param func
   */
  isAsyncFunction(func) {
    func = func.toString().trim();

    return (
      func.match('__awaiter') || func.match('function*') || func.match('async')
    );
  }
}

export default new FigmaMessageEmitter();
