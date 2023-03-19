export default {
  translation: {
    app_name: "Blind Piano",
    app_description:
      "Ein großartiger Musikquiz, aber du spielst selbst das Klavier!",

    languages: {
      en: "Englisch",
      fr: "Französisch",
      de: "Deutsch",
      es: "Spanisch",
    },
    themes: {
      dark: "Dunkel",
      light: "Hell",
    },
    visibilities: {
      public: "Öffentlich",
      private: "Privat",
    },

    lobby_page: {
      create_game: "Spiel erstellen",
      join_game: "Spiel beitreten",
      game_name: "Name des Spiels",
      visibility: "Sichtbarkeit",
      made_by:
        "Hergestellt mit ❤️ von" /* I'm not sure about how to say this in German */,
    },

    success_messages: {
      game_created: "Spiel erfolgreich erstellt",
    },
    server_error_messages: {
      validation_error: "Validierungsfehler",
      unknown_error: "Unbekannter Fehler",
    },
    client_error_messages: {
      game_not_found: "Spiel nicht gefunden",
      join_failed: "Beitritt zu diesem Spiel nicht möglich",
      disconnected_from_server: "Sie wurden vom Server getrennt",
      webmidi_failed:
        "WebMidi konnte nicht aktiviert werden. Bitte überprüfen Sie Ihre Browser-Einstellungen und laden Sie die Seite neu.",
    },
    create_identity_modal: {
      title: "Meine Identität",
      randomize_avatar: "Zufällig",
      nickname_placeholder: "Wie möchten Sie genannt werden?",
      validate_identity: "Meine Identität überprüfen",
    },
    generic: {
      nickname: "Spitzname",
      or: "oder",
      players: "Spieler",
      leader: "Spielleiter",
      you: "Sie",
      kick: "Entfernen",
      promote_game_leader: "Spielleiter befördern",
      edit_my_identity: "Meine Identität bearbeiten",
      chat: "Chat",
      select_midi_device: "MIDI-Gerät auswählen",
      invite_friends: "Freunde einladen",
    },
    chat: {
      input_placeholder: "Nachricht hier eingeben",
    },
    validation_rules: {
      max_char: "Maximal {{max}} Zeichen",
      min_char: "Mindestens {{min}} Zeichen",
      between_char: "Zwischen {{min}} und {{max}} Zeichen",
      required: "Erforderlich",
    },
    notification_messages: {
      player_joined: "{{nickname}} ist dem Spiel beigetreten",
      player_left: "{{nickname}} hat das Spiel verlassen",
      new_leader: "{{nickname}} ist der neue Spielleiter",
      you_are_new_leader: "Sie sind der neue Spielleiter",
      player_kicked: "{{nickname}} wurde aus dem Spiel entfernt",
      you_were_kicked: "Sie wurden aus dem Spiel entfernt",
      webmidi_enabled: "WebMidi erfolgreich aktiviert",
      link_copied: "Link in die Zwischenablage kopiert",
    },
  },
};
