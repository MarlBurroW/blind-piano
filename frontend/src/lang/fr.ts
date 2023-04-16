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
    loading_messages: {
      loading_instrument: "Chargement de l'instrument {{name}}",
    },

    success_messages: {
      game_created: "Partie créée avec succès",
      instrument_loaded: "Instrument {{name}} chargé",
    },
    server_error_messages: {
      validation_error: "Erreur de validation",
      unknown_error: "Erreur inconnue",
    },
    client_error_messages: {
      instrument_loading_failed: "Impossible de charger l'instrument {{name}}",
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
    select_instrument_modal: {
      title: "Mon instrument",
      search_instrument: "Rechercher un instrument",
      all_instruments: "Tous",
      bookmarks: "Favoris",
    },
    select_player_modal: {
      title: "Sélectionner un joueur",
    },
    mixer_modal: {
      title: "Mixeur",
    },
    cache_modal: {
      title: "Mise en cache des instruments",
      cache_description:
        "Pour une meilleure expérience, il est conseillé de mettre en cache l'intégralité des instruments dans votre navigateur afin de diminuer le traffic réseau.",
      start_caching: "Démarrer la mise en cache",
      resource: "Ressource",
      completed: "Mise en cache terminée",
      progress: "Progression",
      errorCount: "Nombre d'erreurs",
      cachedCount: "Nombre de ressources mises en cache",
      close_modal: "Fermer",
      maybe_later: "Peut-être plus tard",
      not_now: "Pas maintenant",
      dont_ask_later: "Ne plus me proposer cette option",
      checking_cache: "Vérification du cache en cours...",
      cache_size: "Taille des resources téléchargées",
      cache_status: "Resources enregistrées en cache",
      no_resource_cached: "Aucune ressource mise en cache pour le moment",
      some_resources_not_cached: "Certaines ressources ne sont pas en cache",
      all_resources_cached: "Toutes les ressources sont en cache",
      continue_in_background: "Continuer en tâche de fond",
    },
    track_modal: {
      create_track: "Créer une piste",
      edit_track: "Modifier la piste",
      track_name: "Nom de la piste",
      assigned_player: "Joueur assigné à la piste",
    },
    generic: {
      nickname: "Pseudo",
      color: "Couleur",
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
      instrument: "Instrument",
      master_volume: "Volume général",
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
      cached_completed:
        "Mise en cache terminée: {{count}} ressources mises en cache sur {{total}}",
      player_joined: "{{nickname}} a rejoint la partie",
      player_left: "{{nickname}} a quitté la partie",
      new_leader: "{{nickname}} est le nouveau chef de partie",
      you_are_new_leader: "Vous êtes le nouveau chef de partie",
      player_kicked: "{{nickname}} a été expulsé de la partie",
      you_were_kicked: "Vous avez été expulsé de la partie",
      webmidi_enabled: "WebMidi activé avec succès",
      link_copied: "Lien copié dans le presse-papier",
    },

    inputs: {
      player_input: {
        placeholder: "Sélectionner un joueur",
      },
    },

    tracks: {
      track: "Piste",
      tracks: "Pistes",
      remove_track: "Supprimer la piste",
      take_control: "Prendre le contrôle",
      stop_control: "Arrêter le contrôle",
      change_instrument: "Changer d'instrument",
    },
  },
};
