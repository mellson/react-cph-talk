import { assign, createMachine } from 'xstate';
import { User } from '~/components/User';
import { isErrorWithMessage } from '~/server/utils';
import { client } from '~/utils/trpc';

interface FriendStatus {
  isFriend: boolean;
  isBestFriend: boolean;
}

/** @xstate-layout N4IgpgJg5mDOIC5QFVZgE4AICyBDAxgBYCWAdmAHQCSEANmAMQDKYALpgI4CuGAnoqAAOAe1jFWxYaQEgAHogC0AVgAsAJgoBGNUoAMAdnUAOIypVG1AGhD8EagMwUjATnub9qlft321u1wC+AdaoGDgEJOQUACJgAEbCXKT4ZFDMYLjoRDIiYhJSMvIICvZmFGZ6zs6aKpruKgBsKta2Cpq6DRQOavpGDbq6qpqlQSFoWHhEZJSxCUkppGks7Nx8OaLiktJIcooqqhRVbs4NFkonHS17nUZKfs59Jrraqg2jIKETEdMx8YnJqQYslgrFwrEouAAZuD0AAKewDACUDE+4SmUVm-wWUHWeS2hUUmhchzUwyUQxc+l8DSuxT8jgazlJ9iqDTUVU0d3eqMmkUoTEIwgA7qlMFxxrB0vR8OxxRhcZsCjsiipdCotEpDIzzEoGvp9HraQp6RRDKY2T02eTueM0XyKALhaK5ehJctODx0LYhBt8ttQEU1Gp1Wq-I1GUYPL19LT1Sy3LddEZOWZ+kYbWFeT9HSLFpgMOhhOgGABheiZfPoQvoBV+gnFBoNRylcl6tW+JT2GM2RAVLr2ZODIwspOaJoZr7o-mCoVi8bpdiQ9DEMCkCCYEFg8W1-HKxAD5wUPQuRruI4dGk9hDDONNcknLvVFT2Cd27MzucYBcetY7XKK-1dgQZMnCUOoLSfewwMvWw2S0fROV6NwBgeDxXyzKIWEydEoEwSEi0-V0GAgKRKDIAA3YQAGtKB5b5MIyLJIlw-CsBdWAEAo4R8DBLYAG1dAAXR3JUA0UTo-E1cwzE0apfD6I0iUPYNzV0NRTlqOp02CD5bQw-lGJwvCCPYhgCyLChBFoMFWIAWwoOipwdQzmOMtiJU40hKJ4v0BOEv9fV3MS6S8LpNWOIN3AHWkx00LoXDHWp9DUc1NXQ+iDOw1zWMIyVgVBcEKChGFYX6JEUT0jLnKy0UcvYkTAKKdpHAsZwfGSpRTE1VxaT8IwukaQxnEMBFTANdKnOWCQ8yXFc1w3ArxWI0iKC4miHMqya2Gmljl1XddN1YcVPO83ipD8hr6wadwKFHfpVR8NqYMQZx1V1UxGnepMfDUCb7Sm2q9vmw6lvM9BLOs1g7I2zMqoBmagYOxaOK4nz+KEy69wQa7dAoew2VMSNZK8RlevsRwBhS1VU28cm-uzbbAbmpGtzyw6IWhDBSoGXRkUc-7GYR5mFtZzHgu0DRugGZ8KnMFlaRbJx8ceFLHrHIIdNIYQIDgGR+Z+Gh6DFoDlB0eKn3OVwHkU7R+1VrTvDvbSxlhpzMXmVJjaKEoGiUfs1OusquxMGL9CcVw-DHNVnF1dwlHpzCZ2dCUvcQPww4HJSTCMNVdX2I0mVNeS47A1QdH0BPpydPMwdT4ouw0Z5I9VUpn1k2NOqLnO2pzvVXC7SuHQ-F069VfqDFUFkHk5PUjCNXHblJYYni1HQmUHrCmNqkyU4CvFRJNpfbsaKCmRZBC+maK82gMAauvkpMT43wXduFkH4D3gD61KTp-BMUpIxeGeKoXqBpyh9ARA9cm7I3g6X1uQOuChTgZ32Lqbwz4dBdiND0P2Zp9iRmqOBZwGsAhAA */
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
        after: {
          '300': {
            target: 'Searching for users',
          },
        },
        on: {
          Search: {
            target: 'Searching for users',
          },
          'Set query': {
            actions: 'setQuery',
          },
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
      'Showing timeout error': {},
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
              internal: false,
            },
            {
              actions: 'setErrorMessage',
              target: 'Showing error',
            },
          ],
        },
        after: {
          '6000': {
            target: 'Showing timeout error',
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
              internal: false,
            },
            {
              target: 'Showing error',
            },
          ],
        },
        after: {
          '6000': {
            target: 'Showing timeout error',
          },
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
