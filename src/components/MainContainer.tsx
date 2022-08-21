import { Container, Heading, Progress, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = { isLoading: boolean; children: ReactNode };
export const MainContainer = ({ isLoading, children }: Props) => {
  return (
    <Container p={18} justifyContent="center" w="100vw" h="100vh">
      <VStack gap={8} justify="center" h="full" p={12}>
        <VStack>
          <Heading px={4}>Stately ❤️ React CPH</Heading>
          <Progress
            isIndeterminate={isLoading}
            w="full"
            colorScheme="red"
            rounded="md"
          />
        </VStack>
        {children}
      </VStack>
    </Container>
  );
};
