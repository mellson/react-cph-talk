import { Avatar, Box, HStack } from '@chakra-ui/react';
import { AsyncSelect, chakraComponents } from 'chakra-react-select';
import { client } from '~/utils/trpc';

interface Props {
  onChange: (user: Awaited<typeof client.user.search>) => void;
}

export const UserSearcher = (props: Props) => {
  return (
    <AsyncSelect
      instanceId="usersearch"
      placeholder="Search for a user..."
      noOptionsMessage={() => 'Type to search for users'}
      loadingMessage={() => 'Loading users...'}
      loadOptions={(query: string) => client.user.search.query(query)}
      components={{
        Option: (props) => {
          return (
            <chakraComponents.Option {...props}>
              <HStack key={props.data.id} w="full">
                <Avatar name={props.data.avatar} src={props.data.avatar} />
                <Box>{props.data.name}</Box>
              </HStack>
            </chakraComponents.Option>
          );
        },
      }}
    />
  );
};
