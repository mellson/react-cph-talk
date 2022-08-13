import { Avatar, Box, Heading, HStack, VStack } from '@chakra-ui/react';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';

const IndexPage: NextPageWithLayout = () => {
  const usersQuery = trpc.useQuery(['user.all']);

  return (
    <>
      <Heading>
        Users
        {usersQuery.status === 'loading' && '(loading)'}
      </Heading>
      <VStack justify="start">
        {usersQuery.data?.map((user) => (
          <HStack key={user.id} w="full">
            <Avatar name={user.name} src={user.avatar} />
            <Box>{user.name}</Box>
          </HStack>
        ))}
      </VStack>
    </>
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
