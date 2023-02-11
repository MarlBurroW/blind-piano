export default {
  translation: {
    app_name: "Blind Piano",
    app_description: "Un super blind test mais tu joues la musique!",

    languages: {
      en: "Anglais",
      fr: "Français",
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
    },
    create_identity_modal: {
      title: "Créez votre identité",
      randomize_avatar: "Aléatoire",
      nickname_placeholder: "Comment voulez-vous être appelé?",
      join_game: "Rejoindre la partie",
    },
    generic: {
      nickname: "Pseudo",
      or: "ou",
      players: "Joueurs",
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
    },
  },
};
