import {
  Avatar,
  Box,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import { AsyncSelect, chakraComponents } from 'chakra-react-select';
import { useState } from 'react';
import { MainContainer } from '~/components/MainContainer';
import { client } from '~/utils/trpc';
import { NextPageWithLayout } from './_app';

type User = Awaited<ReturnType<typeof client.user.search.query>>[number];

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
                  <HStack key={props.data.user.id} w="full">
                    <Avatar
                      name={props.data.user.avatar}
                      src={props.data.user.avatar}
                    />
                    <Box>{props.data.user.name}</Box>
                  </HStack>
                </chakraComponents.Option>
              );
            },
          }}
        />
        {user && (
          <VStack pt={4}>
            <Heading>Selected user</Heading>
            <Text>{user.name}</Text>
            <Text>{user.id}</Text>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="email-alerts" mb="0">
                Friends?
              </FormLabel>
              <Switch
                id="email-alerts"
                size="lg"
                isChecked={user.isFriend}
                onChange={async (e) => {
                  setIsLoading(true);
                  const updatedUser = await client.user.setFriend.mutate({
                    userId: user.id,
                    isFriend: e.target.checked,
                  });
                  setUser(updatedUser);
                  setIsLoading(false);
                }}
              />
            </FormControl>
            {isLoading && <Spinner />}
          </VStack>
        )}
      </SimpleGrid>
    </MainContainer>
  );
};

export default IndexPage;
