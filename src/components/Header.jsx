import React from "react";

import { Heading, Flex } from "@chakra-ui/react";

function Header() {
  return (
    <Flex w="100%" bg="blue.600" h="50px">
      <Heading ml="8" size="md" fontWeight="semibold" color="white">
        Event App
      </Heading>
    </Flex>
  );
}

export default Header;
