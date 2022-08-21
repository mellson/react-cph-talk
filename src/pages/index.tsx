import { Heading, SimpleGrid, Spinner, VStack } from '@chakra-ui/react';
import { AsyncSelect, chakraComponents } from 'chakra-react-select';
import { useState } from 'react';
import { MainContainer } from '~/components/MainContainer';
import { Toggle } from '~/components/Toggle';
import { User } from '~/components/User';
import { client } from '~/utils/trpc';
import { NextPageWithLayout } from './_app';

const IndexPage: NextPageWithLayout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState<User>();

  return (
    <MainContainer>
      <SimpleGrid columns={1} w="full">
        <AsyncSelect
          instanceId="usersearch"
          placeholder="Search for a user..."
          noOptionsMessage={() => 'Type to search for users'}
          loadingMessage={() => 'Loading users...'}
          loadOptions={async (query: string) =>
            (await client.user.search.query({ query })).map((user) => ({
              label: user.name,
              user: user,
            }))
          }
          onChange={(option) => setUser(option?.user)}
          components={{
            Option: (props) => {
              return (
                <chakraComponents.Option {...props}>
                  <User key={props.data.user.id} user={props.data.user} />
                </chakraComponents.Option>
              );
            },
          }}
        />
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
            {isLoading && <Spinner />}
          </VStack>
        )}
      </SimpleGrid>
    </MainContainer>
  );
};

export default IndexPage;
