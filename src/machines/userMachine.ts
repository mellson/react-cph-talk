import { assign, createMachine } from 'xstate';
import { User } from '~/components/User';
import { isErrorWithMessage } from '~/server/utils';
import { client } from '~/utils/trpc';

interface FriendStatus {
  isFriend: boolean;
  isBestFriend: boolean;
}

/** @xstate-layout N4IgpgJg5mDOIC5QFVZgE4AICyBDAxgBYCWAdmAHQCSEANmAMQDKYALpgI4CuGAnoqAAOAe1jFWxYaQEgAHogC0AVgAsAJgoBGNUoAMAdnUAOIypVG1AGhD8EagMwUjATnub9qlft321u1wC+AdaoGDgEJOQULLjoRGRQmABmwlhcaOiwDBBSlGQAbsIA1pShWHjxUTFxkYkpaRmwCAXC+LgSUgDaugC6MiJiHdJIcoiamlpGAGwqurpKhkoOmvYq1rYKmrpTFA5qRro6ms46KvZGQSEZ4ZWU1ZV1qZjpGFkY6KkUgrTt9QC2FDKN0idzAsQeySeL0yzVIhTaQ26fRGA3EkmGoHkCAUai8uwWalcUymmjOqiM60Qzl0FCWUzU+iMxymJhWF2CICBFRB0UIwgA7glno1mGB6Ph2ND+qI0VIZFjZvotCpNAcXEolKqVVNKdjphR9L4mQt7JrNCy1JdOdduWQ7nzBaREu9UgwAML0WKYF3oaWDdHyxTEjT2bZzQma+z0qw2RCmnZ6fYqakM5zJ5xWrkRO28gXCjCi9hJdDEMCkCCYWCsdrpP2yjGjBDnZy0-xhi2aJRTey6ky7IxLfQsqbeNPmTM27NVNgSJ3JEtlitVmtZHJRFolQGT27RGdC4ul8uV6usdKw+HtdFIutDQMIElK3RMqa6WY+ak62MINO0llmKZdmqPiWhyWY7iwrCznUC5Hsup5vOgHzoF8PysP8W5hLa06QfuMFLieZ4tAiV69DeAYjFiJI0lGSZGPoxxeFMzi6g4jjhqYr4qCOPj2BOmFTpQAAiYAAEbCFwpD4AkorgoQZFyhRiirCoFBmHozjOKS4yGDMuqbNsuy+IyL7zCqqx8eUAkUMJYkSVJTqFpwPDoLYQgyreinYioqgUBpbjOBaSgBdselcU4Sz+NMJi6NoqhTEEHKkMIEBwDIYE8jQ9DyQ2WLKDo-aad5fnOBSX6bNohn7DFqreDMSjslc-HgWCNT7lCjTZXeOLjBQr7dkFDjOPR0xrGVWxKriphKEaT5cbxoHbjyTAOkK0LwCi7nkZiiB+Eq5yqiV0XeXVeknAaRruBqnbqAsFnAjmy0CkKPqdZ5Cj2N4vn6Li6Y3bMo22B9NLsfY9gaV2JLxQtTVLQ6+a+ht-oKdtCCzEYvUeGcGnGiOpUbDSA5qOM5wHDpOgnHdWGgjhc4Houx4rq9KOrDskXqvRtE9l+7jo6OOjDVGSwmJTVk2eJkkJEzjbvQBhmHJDcwfSYuruE4rh+Oar7OF2l0i7cUu5cOFChiZEYrNGelapV+gBUFJw-fNQRAA */
export const userMachine = createMachine(
  {
    context: { query: '', numberOfRetries: 0 },
    tsTypes: {} as import('./userMachine.typegen').Typegen0,
    schema: {
      context: {} as {
        errorMessage?: string;
        query: string;
        users?: User[];
        selectedUser?: User;
        friendStatus?: FriendStatus;
        numberOfRetries: number;
      },
      events: {} as
        | { type: 'Set query'; query: string }
        | { type: 'Search' }
        | { type: 'Clear error' }
        | { type: 'Select user'; user: User }
        | {
            type: 'Set friend status';
            friendStatus: FriendStatus;
          },
      services: {} as {
        search: { data: User[] };
        setFriendStatus: { data: User };
      },
    },
    id: 'User Machine',
    initial: 'Idle',
    states: {
      Idle: {
        on: {
          'Set query': {
            actions: 'setQuery',
            target: 'Debouncing',
          },
        },
      },
      Debouncing: {
        on: {
          Search: {
            target: 'Searching for users',
          },
          'Set query': {
            actions: 'setQuery',
          },
        },
        after: { 300: 'Searching for users' },
      },
      'Searching for users': {
        invoke: {
          src: 'search',
          onDone: [
            {
              actions: ['setUsers', 'resetNumberOfRetries'],
              target: 'Showing users',
            },
          ],
          onError: [
            {
              actions: ['increaseNumberOfRetries', 'setErrorMessage'],
              cond: 'canRetry',
              target: 'Searching for users',
            },
            {
              actions: 'setErrorMessage',
              target: 'Showing error',
            },
          ],
        },
      },
      'Showing users': {
        on: {
          'Select user': {
            actions: ['selectUser', 'clearUsers', 'clearQuery'],
            target: 'Show user',
          },
          'Set query': {
            actions: 'setQuery',
            target: 'Debouncing',
          },
        },
      },
      'Showing error': {
        on: {
          'Clear error': {
            actions: 'resetNumberOfRetries',
            target: 'Idle',
          },
        },
      },
      'Show user': {
        on: {
          'Set friend status': {
            actions: 'setFriendStatus',
            target: 'Setting friend status',
          },
          'Set query': {
            actions: ['setQuery', 'clearUser'],
            target: 'Debouncing',
          },
        },
      },
      'Setting friend status': {
        invoke: {
          src: 'setFriendStatus',
          onDone: [
            {
              actions: ['selectUser', 'resetNumberOfRetries'],
              target: 'Show user',
            },
          ],
          onError: [
            {
              actions: ['increaseNumberOfRetries', 'setErrorMessage'],
              cond: 'canRetry',
              target: 'Setting friend status',
            },
            {
              target: 'Showing error',
            },
          ],
        },
      },
    },
  },
  {
    guards: {
      canRetry: (context) => context.numberOfRetries < 3,
    },
    actions: {
      setQuery: assign({
        query: (_, event) => event.query,
      }),
      clearQuery: assign({
        query: (_) => '',
      }),
      setErrorMessage: assign({
        errorMessage: (_, event) => {
          if (isErrorWithMessage(event.data)) {
            return event.data.message;
          } else return undefined;
        },
      }),
      increaseNumberOfRetries: assign({
        numberOfRetries: (context) => context.numberOfRetries + 1,
      }),
      resetNumberOfRetries: assign({
        numberOfRetries: (_) => 0,
      }),
      setUsers: assign({
        users: (_, event) => event.data,
      }),
      clearUsers: assign({
        users: (_) => [],
      }),
      setFriendStatus: assign({
        friendStatus: (_, event) => event.friendStatus,
      }),
      selectUser: assign({
        selectedUser: (_, event) => {
          if (event.type === 'Select user') {
            return event.user;
          } else {
            return event.data;
          }
        },
      }),
      clearUser: assign({
        selectedUser: (_) => undefined,
      }),
    },
    services: {
      search: (context) =>
        client.user.search.query({
          query: context.query,
        }),
      setFriendStatus: (context) => {
        if (context.selectedUser && context.friendStatus) {
          return client.user.setFriendStatus.mutate({
            userId: context.selectedUser.id,
            isFriend: context.friendStatus.isFriend,
            isBestFriend: context.friendStatus.isBestFriend,
          });
        } else {
          throw new Error('No setting friend status without a user and status');
        }
      },
    },
  },
);
