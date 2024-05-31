import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Header from "./Header";
import { Footer } from "./Footer";

export const Root = () => (
  <Box
    background="white"
    fontFamily="Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"
    maxWidth="100vw"
    minHeight="100vh"
  >
    <Header />
    <Box minH="calc(100vh - 100px)">
      <Outlet />
    </Box>

    <Footer />
  </Box>
);
