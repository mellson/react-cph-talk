// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.User Machine.Searching for users:invocation[0]': {
      type: 'done.invoke.User Machine.Searching for users:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.User Machine.Setting friend status:invocation[0]': {
      type: 'done.invoke.User Machine.Setting friend status:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.User Machine.Searching for users:invocation[0]': {
      type: 'error.platform.User Machine.Searching for users:invocation[0]';
      data: unknown;
    };
    'error.platform.User Machine.Setting friend status:invocation[0]': {
      type: 'error.platform.User Machine.Setting friend status:invocation[0]';
      data: unknown;
    };
    'xstate.after(300)#User Machine.Debouncing': {
      type: 'xstate.after(300)#User Machine.Debouncing';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    search: 'done.invoke.User Machine.Searching for users:invocation[0]';
    setFriendStatus: 'done.invoke.User Machine.Setting friend status:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    clearQuery: 'Select user';
    clearUser: 'Set query';
    clearUsers: 'Select user';
    increaseNumberOfRetries:
      | 'error.platform.User Machine.Searching for users:invocation[0]'
      | 'error.platform.User Machine.Setting friend status:invocation[0]';
    resetNumberOfRetries:
      | 'Clear error'
      | 'done.invoke.User Machine.Searching for users:invocation[0]'
      | 'done.invoke.User Machine.Setting friend status:invocation[0]';
    selectUser:
      | 'Select user'
      | 'done.invoke.User Machine.Setting friend status:invocation[0]';
    setErrorMessage:
      | 'error.platform.User Machine.Searching for users:invocation[0]'
      | 'error.platform.User Machine.Setting friend status:invocation[0]';
    setFriendStatus: 'Set friend status';
    setQuery: 'Set query';
    setUsers: 'done.invoke.User Machine.Searching for users:invocation[0]';
  };
  eventsCausingServices: {
    search:
      | 'Search'
      | 'error.platform.User Machine.Searching for users:invocation[0]'
      | 'xstate.after(300)#User Machine.Debouncing';
    setFriendStatus:
      | 'Set friend status'
      | 'error.platform.User Machine.Setting friend status:invocation[0]';
  };
  eventsCausingGuards: {
    canRetry:
      | 'error.platform.User Machine.Searching for users:invocation[0]'
      | 'error.platform.User Machine.Setting friend status:invocation[0]';
  };
  eventsCausingDelays: {};
  matchesStates:
    | 'Debouncing'
    | 'Idle'
    | 'Searching for users'
    | 'Setting friend status'
    | 'Show user'
    | 'Showing error'
    | 'Showing users';
  tags: never;
}
