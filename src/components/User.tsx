import { Avatar, Box, HStack } from '@chakra-ui/react';
import { client } from '~/utils/trpc';

export type User = Awaited<ReturnType<typeof client.user.search.query>>[number];

interface Props {
  user: User;
}

export const User = ({ user }: Props) => (
  <HStack>
    <Avatar name={user.name} src={user.avatar} />
    <Box>{user.name}</Box>
  </HStack>
);
