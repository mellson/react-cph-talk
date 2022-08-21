import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Input,
  Progress,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MainContainer } from '~/components/MainContainer';
import { Toggle } from '~/components/Toggle';
import { User } from '~/components/User';
import { client } from '~/utils/trpc';
import { NextPageWithLayout } from './_app';

const IndexPage: NextPageWithLayout = () => {
  const [errorMessage, setErrorMessage] = useState<string>();

  const [query, setQuery] = useState('');
  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);

  const searchUsers = async (query: string) => {
    setUser(undefined);
    const users = await client.user.search.query({ query });
    setUsers(users);
  };

  useEffect(() => {
    if (query.length > 0) {
      searchUsers(query);
    } else {
      setUsers([]);
    }
  }, [query]);

  return (
    <>
      {errorMessage && (
        <Alert status="error">
          <AlertIcon />
          {errorMessage}
          <Button ml={2} size="sm" onClick={() => setErrorMessage(undefined)}>
            Clear error
          </Button>
        </Alert>
      )}
      <MainContainer isLoading={false}>
        <VStack justify="space-between" w="full" h="full">
          <Box w="full">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a user"
              size="lg"
            />
            {users && (
              <VStack pt={2}>
                {users.map((user) => (
                  <Button
                    key={user.id}
                    w="full"
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setQuery('');
                      setUser(user);
                    }}
                  >
                    <User user={user} />
                  </Button>
                ))}
              </VStack>
            )}
          </Box>
          {user && (
            <VStack gap={4} bg="blackAlpha.300" p={8} rounded="lg">
              <User user={user} size="lg" />
              <Progress
                isIndeterminate={false}
                w="full"
                colorScheme="blue"
                size="sm"
                rounded="lg"
              />
              <SimpleGrid columns={2}>
                <Toggle
                  label="Friends?"
                  isChecked={user.isFriend}
                  onChange={async (checked) => {
                    const updatedUser =
                      await client.user.setFriendStatus.mutate({
                        userId: user.id,
                        isFriend: checked,
                        isBestFriend: user.isBestFriend,
                      });
                    setUser(updatedUser);
                  }}
                />
                <Toggle
                  label="Best Friends?"
                  isChecked={user.isBestFriend}
                  onChange={async (checked) => {
                    const updatedUser =
                      await client.user.setFriendStatus.mutate({
                        userId: user.id,
                        isFriend: user.isFriend,
                        isBestFriend: checked,
                      });
                    setUser(updatedUser);
                  }}
                />
              </SimpleGrid>
            </VStack>
          )}
        </VStack>
      </MainContainer>
    </>
  );
};

export default IndexPage;
