export default {
  translation: {
    app_name: "Blind Piano",
    app_description: "An awesome blind test but you play the music!",
    languages: {
      en: "English",
      fr: "French",
    },
    themes: {
      dark: "Dark",
      light: "Light",
    },
    visibilities: {
      public: "Public",
      private: "Private",
    },
    lobby_page: {
      create_game: "Create a game",
      join_game: "Join a game",
      game_name: "Game name",
      visibility: "Visibility",
      no_games: "No games in progress",
    },
    success_messages: {
      game_created: "Game created successfully",
    },
    server_error_messages: {
      validation_error: "Validation error",
      unknown_error: "Unknown error",
    },
    client_error_messages: {
      game_not_found: "Game not found",
      join_failed: "Unable to join this game",
      disconnected_from_server: "You have been disconnected from the server",
    },
    create_identity_modal: {
      title: "Mu identity",
      randomize_avatar: "Randomize",
      nickname_placeholder: "How you want to be called?",
      validate_identity: "Validate my identity",
    },
    generic: {
      nickname: "Nickname",
      or: "or",
      players: "Players",
      leader: "Game leader",
      you: "You",
      kick: "Kick",
      promote_game_leader: "Promote game leader",
      edit_my_identity: "Edit my identity",
      chat: "Chat",
    },
    chat: {
      input_placeholder: "Type your message here",
    },

    validation_rules: {
      max_char: "Maximum {{max}} characters",
      min_char: "Minimum {{min}} characters",
      between_char: "Between {{min}} and {{max}} characters",
      required: "Required",
    },
    notification_messages: {
      player_joined: "{{nickname}} joined the game",
      player_left: "{{nickname}} left the game",
      new_leader: "{{nickname}} is the new game leader",
      you_are_new_leader: "You are the new game leader",
      player_kicked: "{{nickname}} was kicked from the game",
      you_were_kicked: "You were kicked from the game",
    },
  },
};
