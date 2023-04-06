export default {
  translation: {
    app_name: "Blind Piano",
    app_description: "A super blind test but you play the music!",

    languages: {
      en: "English",
      fr: "French",
      de: "German",
      es: "Spanish",
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
      made_by: "Made with ❤️ by",
    },
    loading_messages: {
      loading_instrument: "Loading {{name}} instrument",
    },

    success_messages: {
      game_created: "Game created successfully",
      instrument_loaded: "{{name}} instrument loaded",
    },
    server_error_messages: {
      validation_error: "Validation error",
      unknown_error: "Unknown error",
    },
    client_error_messages: {
      instrument_loading_failed: "Unable to load {{name}} instrument",
      game_not_found: "Game not found",
      join_failed: "Unable to join this game",
      disconnected_from_server: "You have been disconnected from the server",
      webmidi_failed:
        "WebMidi could not be activated. Please check your browser settings and reload the page.",
    },
    create_identity_modal: {
      title: "My identity",
      randomize_avatar: "Randomize",
      nickname_placeholder: "How do you want to be called?",
      validate_identity: "Validate my identity",
    },
    select_instrument_modal: {
      title: "My instrument",
      search_instrument: "Search for an instrument",
      all_instruments: "All",
      bookmarks: "Bookmarks",
    },
    mixer_modal: {
      title: "Mixer",
    },
    cache_modal: {
      title: "Instrument Caching",
      cache_description:
        "For a better experience, it is recommended to cache all instruments in your browser to reduce network traffic.",
      start_caching: "Start Caching",
      resource: "Resource",
      completed: "Caching Completed",
      progress: "Progress",
      errorCount: "Error Count",
      cachedCount: "Number of Cached Resources",
      close_modal: "Close",
      maybe_later: "Maybe Later",
      not_now: "Not Now",
      dont_ask_later: "Do Not Ask Again",
      checking_cache: "Checking Cache...",
      cache_size: "Size of Downloaded Resources",
      cache_status: "Cached Resources",
      no_resource_cached: "No resources cached at this time",
      some_resources_not_cached: "Some resources are not cached",
      all_resources_cached: "All resources are cached",
      continue_in_background: "Continue in Background",
    },
    generic: {
      nickname: "Nickname",
      color: "Color",
      or: "or",
      players: "Players",
      leader: "Game leader",
      you: "You",
      kick: "Kick",
      promote_game_leader: "Promote game leader",
      edit_my_identity: "Edit my identity",
      chat: "Chat",
      select_midi_device: "Select a MIDI device",
      invite_friends: "Invite friends",
      instrument: "Instrument",
    },
    chat: {
      input_placeholder: "Type your message here",
    },
    validation_rules: {
      max_char: "{{max}} maximum characters",
      min_char: "{{min}} minimum characters",
      between_char: "Between {{min}} and {{max}} characters",
      required: "Required",
    },
    notification_messages: {
      cached_completed:
        "Caching completed: {{count}} resources cached out of {{total}}",
      player_joined: "{{nickname}} joined the game",
      player_left: "{{nickname}} left the game",
      new_leader: "{{nickname}} is the new game leader",
      you_are_new_leader: "You are the new game leader",
      player_kicked: "{{nickname}} has been kicked out of the game",
      you_were_kicked: "You were kicked out of the game",
      webmidi_enabled: "WebMidi enabled successfully",
      link_copied: "Link copied to clipboard",
    },
  },
};
