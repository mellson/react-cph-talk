import {
  Avatar,
  Box,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { createTRPCProxyClient } from '@trpc/client';
import { AsyncSelect, chakraComponents } from 'chakra-react-select';
import { useState } from 'react';
import superjson from 'superjson';
import { AppRouter } from '~/server/routers/_app';
import { getBaseUrl } from '../utils/trpc';
import { NextPageWithLayout } from './_app';

const client = createTRPCProxyClient<AppRouter>({
  url: getBaseUrl() + '/api/trpc',
  transformer: superjson,
});

const IndexPage: NextPageWithLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <Container p={8}>
      <VStack gap={8}>
        <Heading>
          Stately ❤️ React CPH
          {/* {usersQuery.status === 'loading' && '(loading)'} */}
        </Heading>
        <SimpleGrid columns={1} w="full">
          <AsyncSelect
            instanceId="usersearch"
            loadOptions={async (query: string) => {
              return (await client.user.search.query(query)).map((user) => ({
                label: user.name,
                value: user.id,
                avatar: user.avatar,
              }));
            }}
            onChange={(user) => {
              setIsLoading(false);
            }}
            components={{
              Option: (props) => {
                return (
                  <chakraComponents.Option {...props}>
                    <HStack key={props.data.value} w="full">
                      <Avatar
                        name={props.data.avatar}
                        src={props.data.avatar}
                      />
                      <Box>{props.data.label}</Box>
                    </HStack>
                  </chakraComponents.Option>
                );
              },
            }}
          />
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('user.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
