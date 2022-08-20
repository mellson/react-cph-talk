import { Container, Heading, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = { children: ReactNode };
export const MainContainer = ({ children }: Props) => {
  return (
    <Container p={18} justifyContent="center" w="100vw" h="100vh">
      <VStack gap={8} justify="center" h="full">
        <Heading>Stately ❤️ React CPH</Heading>
        {children}
      </VStack>
    </Container>
  );
};
