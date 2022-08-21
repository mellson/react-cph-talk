import { Avatar, HStack, Text } from '@chakra-ui/react';
import { client } from '~/utils/trpc';

export type User = Awaited<ReturnType<typeof client.user.search.query>>[number];

interface Props {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const User = ({ user, size = 'sm' }: Props) => (
  <HStack w="full" justify="center">
    <Avatar name={user.name} src={user.avatar} size={size} />
    <Text>{user.name}</Text>
  </HStack>
);
