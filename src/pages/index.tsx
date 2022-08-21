import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Input,
  Progress,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMachine } from '@xstate/react';
import { MainContainer } from '~/components/MainContainer';
import { Toggle } from '~/components/Toggle';
import { User } from '~/components/User';
import { userMachine } from '~/machines/userMachine';
import { NextPageWithLayout } from './_app';

const IndexPage: NextPageWithLayout = () => {
  const [state, send] = useMachine(userMachine);

  return (
    <>
      {state.matches('Showing error') && (
        <Alert status="error">
          <AlertIcon />
          {state.context.errorMessage}
          <Button
            ml={2}
            size="sm"
            onClick={() => send({ type: 'Clear error' })}
          >
            Clear error
          </Button>
        </Alert>
      )}
      <MainContainer
        isLoading={
          state.matches('Searching for users') ||
          state.matches('Setting friend status')
        }
      >
        <VStack justify="space-between" w="full" h="full">
          <Box w="full">
            <Text>Retries: {state.context.numberOfRetries}</Text>
            <Input
              value={state.context.query}
              onChange={(e) =>
                send({ type: 'Set query', query: e.target.value })
              }
              placeholder="Search for a user"
              size="lg"
            />
            {state.context.users && (
              <VStack pt={2}>
                {state.context.users.map((user) => (
                  <Button
                    key={user.id}
                    w="full"
                    size="lg"
                    variant="outline"
                    onClick={() => send({ type: 'Select user', user })}
                  >
                    <User user={user} />
                  </Button>
                ))}
              </VStack>
            )}
          </Box>
          {state.context.selectedUser && (
            <VStack gap={4} bg="blackAlpha.300" p={8} rounded="lg">
              <User user={state.context.selectedUser} size="lg" />
              <Progress
                isIndeterminate={
                  state.matches('Searching for users') ||
                  state.matches('Setting friend status')
                }
                w="full"
                colorScheme="blue"
                size="sm"
                rounded="lg"
              />
              <SimpleGrid columns={2}>
                <Toggle
                  label="Friends?"
                  isChecked={state.context.selectedUser.isFriend}
                  onChange={(checked) => {
                    if (!state.context.selectedUser) return;
                    send({
                      type: 'Set friend status',
                      friendStatus: {
                        isFriend: checked,
                        isBestFriend: state.context.selectedUser.isBestFriend,
                      },
                    });
                  }}
                />
                <Toggle
                  label="Best Friends?"
                  isChecked={state.context.selectedUser.isBestFriend}
                  onChange={(checked) => {
                    if (!state.context.selectedUser) return;
                    send({
                      type: 'Set friend status',
                      friendStatus: {
                        isFriend: state.context.selectedUser.isFriend,
                        isBestFriend: checked,
                      },
                    });
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
