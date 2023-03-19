export default {
  translation: {
    app_name: "Piano a ciegas",
    app_description:
      "¡Un super test para poner a prueba tus conocimientos musicales!",
    languages: {
      en: "Inglés",
      fr: "Francés",
      de: "Alemán",
      es: "Español",
    },
    themes: {
      dark: "Oscuro",
      light: "Claro",
    },
    visibilities: {
      public: "Público",
      private: "Privado",
    },

    lobby_page: {
      create_game: "Crear juego",
      join_game: "Unirse al juego",
      game_name: "Nombre del juego",
      visibility: "Visibilidad",
      made_by: "Realizado con ❤️ por",
    },

    success_messages: {
      game_created: "Juego creado exitosamente",
    },
    server_error_messages: {
      validation_error: "Error de validación",
      unknown_error: "Error desconocido",
    },
    client_error_messages: {
      game_not_found: "Juego no encontrado",
      join_failed: "No se pudo unir al juego",
      disconnected_from_server: "Te has desconectado del servidor",
      webmidi_failed:
        "No se pudo activar WebMidi. Verifique la configuración de su navegador y vuelva a cargar la página.",
    },
    create_identity_modal: {
      title: "Mi identidad",
      randomize_avatar: "Aleatorio",
      nickname_placeholder: "¿Cómo quieres ser llamado?",
      validate_identity: "Validar mi identidad",
    },
    generic: {
      nickname: "Apodo",
      or: "o",
      players: "Jugadores",
      leader: "Líder de equipo",
      you: "Tú",
      kick: "Expulsar",
      promote_game_leader: "Promover líder de equipo",
      edit_my_identity: "Editar mi identidad",
      chat: "Chat",
      select_midi_device: "Seleccionar dispositivo MIDI",
      invite_friends: "Invitar amigos",
    },
    chat: {
      input_placeholder: "Escribe tu mensaje aquí",
    },
    validation_rules: {
      max_char: "{{max}} caracteres máximos",
      min_char: "{{min}} caracteres mínimos",
      between_char: "Entre {{min}} y {{max}} caracteres",
      required: "Requerido",
    },
    notification_messages: {
      player_joined: "{{nickname}} se unió al juego",
      player_left: "{{nickname}} dejó el juego",
      new_leader: "{{nickname}} es el nuevo líder de equipo",
      you_are_new_leader: "Eres el nuevo líder de equipo",
      player_kicked: "{{nickname}} ha sido expulsado del juego",
      you_were_kicked: "Has sido expulsado del juego",
      webmidi_enabled: "WebMidi habilitado correctamente",
      link_copied: "Enlace copiado al portapapeles",
    },
  },
};
