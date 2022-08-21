import {
  Button,
  Heading,
  Input,
  SimpleGrid,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MainContainer } from '~/components/MainContainer';
import { Toggle } from '~/components/Toggle';
import { User } from '~/components/User';
import { client } from '~/utils/trpc';
import { NextPageWithLayout } from './_app';

const IndexPage: NextPageWithLayout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState('');
  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);

  const searchUsers = async (query: string) => {
    setIsLoading(true);
    const users = await client.user.search.query({ query });
    setUsers(users);
    setIsLoading(false);
  };

  useEffect(() => {
    if (query.length > 0) {
      searchUsers(query);
    } else {
      setUsers([]);
    }
  }, [query]);

  return (
    <MainContainer>
      {isLoading && <Spinner />}
      <SimpleGrid columns={1} w="full">
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
        {user && (
          <VStack pt={8} gap={4}>
            <Heading size="lg">Selected user</Heading>
            <User user={user} />
            <SimpleGrid columns={2}>
              <Toggle
                label="Friends?"
                isChecked={user.isFriend}
                onChange={async (checked) => {
                  setIsLoading(true);
                  const updatedUser = await client.user.setFriend.mutate({
                    userId: user.id,
                    isFriend: checked,
                  });
                  setUser(updatedUser);
                  setIsLoading(false);
                }}
              />
              <Toggle
                label="Best Friends?"
                isChecked={user.isBestFriend}
                onChange={async (checked) => {
                  setIsLoading(true);
                  const updatedUser = await client.user.setBestFriend.mutate({
                    userId: user.id,
                    isBestFriend: checked,
                  });
                  setUser(updatedUser);
                  setIsLoading(false);
                }}
              />
            </SimpleGrid>
          </VStack>
        )}
      </SimpleGrid>
    </MainContainer>
  );
};

export default IndexPage;
