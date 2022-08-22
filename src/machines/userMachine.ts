import { assign, createMachine } from 'xstate';
import { User } from '~/components/User';
import { isErrorWithMessage } from '~/server/utils';
import { client } from '~/utils/trpc';

interface FriendStatus {
  isFriend: boolean;
  isBestFriend: boolean;
}

/** @xstate-layout N4IgpgJg5mDOIC5QFVZgE4AICyBDAxgBYCWAdmAHQCSEANmAMQDKYALpgI4CuGAnoqAAOAe1jFWxYaQEgAHogC0AVgAsAJgoBGNUoAMAdnUAOIypVG1AGhD8EagMwUjATnub9qlft321u1wC+AdaoGDgEJOQUACJgAEbCXKT4ZFDMYLjoRDIiYhJSMvIICvZmFGZ6zs6aKpruKgBsKta2Cpq6DRQOavpGDbq6qpqlQSFoWHhEZJSxCUkppGks7Nx8OaLiktJIcooqqhRVbs4NFkonHS17nUZKfs59Jrraqg2jIKETEdMx8YnJqQYslgrFwrEouAAZuD0AAKewDACUDE+4SmUVm-wWUHWeS2hUUmhchzUwyUQxc+l8DSuxT8jgazlJ9iqDTUVU0d3eqMmkUoLEy6KgmEhwiwXHGsAYECklDIADdhABrSg875RAVZSLC0XiyUIBXCfBgrYAbV0AF1cZsCjsigpOn4lIZTLVqr4+rS2sS1OZGro1KdanUjNzxmi+RRNUKRWLMBKMFKMOgxRRBLQwbqALYUNXo-kZLWpWN6xMG0iK435Ujmq07XI27age2+-RdZ3HNSkqlGWmaBqaLoufu1fRqUwNZ1hsK8n5MQjCADuxYT6ClLHo+HYq+t1YJCBUuhUWmdjWc5iUDX0+ivXvpFBdjS7N50SmnX3zUYXy8W8cl6RWHh0FsIQNj3O1EC7Y8jz8RpGSMDxen0WljxZNxbl0IxOTMfpQ2CD5w1nDVv2LZMxQYABhehMkwMj0F3fEIOKBoGkcUpySvI9fCUexkJsRAKi6ewsMGIwWUwkd3wjOdvz-DAAJFdBiDAUgIEwEEwQlBjbWbRBhOcCg9BcRp3CODoaX4hBhlQppyROXjqhUewpKI-lZNXBTVmA7Sm12BAsKcJQ6jZdkansIKLNsNktH0TlejcAYHg8Fz1QLVgJF-SElJUtSNNYCVpVlChDRVXNCNSqM2AynVstU9TQXy2By0rE0pFrHz9wHNsJP6Q8fGcS5LPPQyg0aS8jEwnw1BSz9lmqxTlLqvKCrotMM1YbMypnCq5uLLLFtyhqJWao1WprS0OqYgddAoew2VMBDNHPG9nFpBxHAGcdDxw7x7Gc95SGECA4BkPNIxoehLt04o7iUIdHPOVwHi9OoNG6CaQ28Wy8LGbbP0xeZUihvySknISAwHfofF6XtLPcJxXD8fsj2cS93DffCwbnQsY11OS12Jls6goI9WPOBxnFivpmkstoDC6P0ePHTDGn+3GP0jeclxXSVBcg+XhKJB4nn2WyvSZB8PXZoLVB0fQZs1kjfzovXil4jRniZw9Sicp6UKUIxLYmgaJqvVxeIdmSl3513D0DgxVBZB5OSvWnWhu25SWGJ5DDZcXI41Kq9tqw7NPgeswMY6HSk6fwTFKBCvGeVQ3pvco+gRPq-vZN5OfK-NXYdBDbv2S9vCcnReLvDwHz9Jo7uExD7aCAIgA */
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
              internal: false,
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
