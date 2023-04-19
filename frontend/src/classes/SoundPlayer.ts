import { Player, getDestination } from "tone";
import { Destination } from "tone/build/esm/core/context/Destination";

export class SoundPlayer {
  private sounds: Map<string, Player> = new Map();
  private output?: AudioNode;

  constructor(output?: AudioNode) {
    this.output = output;
  }

  public addSound(key: string, src: string) {
    const player = new Player({
      url: src,
      autostart: false,
    });

    if (this.output) {
      player.connect(this.output);
    }

    this.sounds.set(key, player);
  }

  public setOutput(output: AudioNode) {
    this.output = output;

    this.sounds.forEach(sound => {});
  }

  public playSound(key: string) {
    const sound = this.sounds.get(key);
    if (!sound) {
      throw new Error(`Sound not found with key: ${key}`);
    }
    sound.start();
    console.log("sound played");
  }
}

export default SoundPlayer;
