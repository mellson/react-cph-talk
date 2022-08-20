import { SimpleGrid } from '@chakra-ui/react';
import { useState } from 'react';
import { MainContainer } from '~/components/MainContainer';
import { UserSearcher } from '~/components/UserSearcher';
import { NextPageWithLayout } from './_app';

const IndexPage: NextPageWithLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <MainContainer>
      <SimpleGrid columns={1} w="full">
        <UserSearcher />
      </SimpleGrid>
    </MainContainer>
  );
};

export default IndexPage;
