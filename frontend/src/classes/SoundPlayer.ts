import { Player } from "tone";
export class SoundPlayer {
  private sounds: Map<string, Player> = new Map();

  constructor() {
    // Initialisez tous les sons que vous souhaitez utiliser dans votre jeu.
  }

  public addSound(key: string, src: string) {
    const player = new Player({
      url: src,
      autostart: false,
    });

    this.sounds.set(key, player);
  }

  public playSound(key: string) {
    const sound = this.sounds.get(key);
    if (!sound) {
      throw new Error(`Sound not found with key: ${key}`);
    }
    sound.start();
  }
}

export default SoundPlayer;
