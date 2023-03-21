import { SoundPlayer } from "../classes/SoundPlayer";

const baseSfxUrl = import.meta.env.DEV
  ? import.meta.env.VITE_STATIC_URL + "/audio/sfx/"
  : "/audio/sfx/";

const sfx = new SoundPlayer();

const sounds = [
  {
    key: "player-joined",
    src: "player-joined.mp3",
  },
  {
    key: "player-left",
    src: "player-left.mp3",
  },
  {
    key: "player-kicked",
    src: "player-kicked.mp3",
  },
  {
    key: "you-are-promoted",
    src: "you-are-promoted.mp3",
  },
  {
    key: "chat-message",
    src: "chat-message.mp3",
  },
];

sounds.forEach((sound) => {
  sfx.addSound(sound.key, baseSfxUrl + sound.src);
});

export default sfx;
