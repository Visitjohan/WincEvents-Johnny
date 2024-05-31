import { Text, Flex, Center } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Center>
      <Flex w="100%" bg="blue.600" h="50px">
        <Text color={"white"} pr={"10px"} textAlign="Center">
          Coded By Johnny {"\u00A9"}
          {new Date().getFullYear()}
        </Text>
      </Flex>
    </Center>
  );
};
