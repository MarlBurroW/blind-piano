export default {
  translation: {
    app_name: "Blind Piano",
    app_description: "Un super blind test mais tu joues la musique!",

    languages: {
      en: "Anglais",
      fr: "Français",
      de: "Allemand",
      es: "Espagnol",
    },
    themes: {
      dark: "Sombe",
      light: "Clair",
    },
    visibilities: {
      public: "Public",
      private: "Privée",
    },

    lobby_page: {
      create_game: "Créer une partie",
      join_game: "Rejoindre une partie",
      game_name: "Nom de la partie",
      visibility: "Visibilité",
      made_by: "Réalisé avec ❤️ par",
    },

    success_messages: {
      game_created: "Partie créée avec succès",
    },
    server_error_messages: {
      validation_error: "Erreur de validation",
      unknown_error: "Erreur inconnue",
    },
    client_error_messages: {
      game_not_found: "Partie introuvable",
      join_failed: "Impossible de rejoindre cette partie",
      disconnected_from_server: "Vous avez été déconnecté du serveur",
      webmidi_failed:
        "WebMidi n'a pas pu être activé. Veuillez vérifier les paramètres de votre navigateur et recharger la page.",
    },
    create_identity_modal: {
      title: "Mon identité",
      randomize_avatar: "Aléatoire",
      nickname_placeholder: "Comment voulez-vous être appelé?",
      validate_identity: "Valider mon identité",
    },
    generic: {
      nickname: "Pseudo",
      or: "ou",
      players: "Joueurs",
      leader: "Chef de partie",
      you: "Vous",
      kick: "Expulser",
      promote_game_leader: "Promouvoir chef de partie",
      edit_my_identity: "Modifier mon identité",
      chat: "Chat",
      select_midi_device: "Sélectionner un périphérique MIDI",
      invite_friends: "Inviter des amis",
    },
    chat: {
      input_placeholder: "Tapez votre message ici",
    },
    validation_rules: {
      max_char: "{{max}} caractères maximum",
      min_char: "{{min}} caractères minimum",
      between_char: "Entre {{min}} et {{max}} caractères",
      required: "Requis",
    },
    notification_messages: {
      player_joined: "{{nickname}} a rejoint la partie",
      player_left: "{{nickname}} a quitté la partie",
      new_leader: "{{nickname}} est le nouveau chef de partie",
      you_are_new_leader: "Vous êtes le nouveau chef de partie",
      player_kicked: "{{nickname}} a été expulsé de la partie",
      you_were_kicked: "Vous avez été expulsé de la partie",
      webmidi_enabled: "WebMidi activé avec succès",
      link_copied: "Lien copié dans le presse-papier",
    },
  },
};
