import { Howl } from "howler";

export class SoundPlayer {
  private sounds: Map<string, Howl> = new Map();

  constructor() {
    // Initialisez tous les sons que vous souhaitez utiliser dans votre jeu.
  }

  public addSound(key: string, src: string | string[]) {
    this.sounds.set(key, new Howl({ src }));
  }

  public playSound(key: string) {
    const sound = this.sounds.get(key);
    if (!sound) {
      throw new Error(`Sound not found with key: ${key}`);
    }
    sound.play();
  }
}

export default SoundPlayer;
