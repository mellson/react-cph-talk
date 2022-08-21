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
import { isErrorWithMessage } from '~/server/utils';
import { client } from '~/utils/trpc';
import { NextPageWithLayout } from './_app';

const IndexPage: NextPageWithLayout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const [query, setQuery] = useState('');
  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);

  const searchUsers = async (query: string) => {
    setIsLoading(true);
    setUser(undefined);
    try {
      const users = await client.user.search.query({ query });
      setUsers(users);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      if (isErrorWithMessage(error)) {
        setErrorMessage(error.message);
      }
    }
  };

  useEffect(() => {
    if (query.length > 0) {
      searchUsers(query);
    } else {
      setUsers([]);
    }
  }, [query]);

  useEffect(() => {
    setIsLoading(false);
    setIsSuccess(errorMessage === undefined);
  }, [errorMessage]);

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
      <MainContainer isLoading={isLoading}>
        <VStack justify="space-between" w="full" h="full">
          <Box w="full">
            <Input
              value={query}
              disabled={!isSuccess}
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
                isIndeterminate={isLoading}
                w="full"
                colorScheme="blue"
                size="sm"
                rounded="lg"
              />
              <SimpleGrid columns={2}>
                <Toggle
                  label="Friends?"
                  disabled={!isSuccess || isLoading}
                  isChecked={user.isFriend}
                  onChange={async (checked) => {
                    setIsLoading(true);
                    try {
                      const updatedUser =
                        await client.user.setFriendStatus.mutate({
                          userId: user.id,
                          isFriend: checked,
                          isBestFriend: user.isBestFriend,
                        });
                      setUser(updatedUser);
                      setIsLoading(false);
                      setIsSuccess(true);
                    } catch (error) {
                      if (isErrorWithMessage(error)) {
                        setErrorMessage(error.message);
                      }
                    }
                  }}
                />
                <Toggle
                  label="Best Friends?"
                  disabled={!isSuccess || isLoading}
                  isChecked={user.isBestFriend}
                  onChange={async (checked) => {
                    setIsLoading(true);
                    try {
                      const updatedUser =
                        await client.user.setFriendStatus.mutate({
                          userId: user.id,
                          isFriend: user.isFriend,
                          isBestFriend: checked,
                        });
                      setUser(updatedUser);
                      setIsLoading(false);
                      setIsSuccess(true);
                    } catch (error) {
                      if (isErrorWithMessage(error)) {
                        setErrorMessage(error.message);
                      }
                    }
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
