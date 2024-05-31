import React from "react";
import { useToast, useDisclosure } from "@chakra-ui/react";
import {
  Text,
  Heading,
  Image,
  IconButton,
  Center,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { ArrowBackIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";

import { useState, useRef } from "react";
import AlertBox from "../components/AlertBox";
import EditEventModal from "../components/EditEventModal";
//import moment from "moment";

export const loader = async ({ params }) => {
  const eventUrl = `http://localhost:3000/events/${params.eventId}`;
  const usersUrl = "http://localhost:3000/users";
  const categoriesUrl = "http://localhost:3000/categories";

  const [eventResponse, usersResponse, categoriesResponse] = await Promise.all([
    fetch(eventUrl),
    fetch(usersUrl),
    fetch(categoriesUrl),
  ]);

  const event = await eventResponse.json();
  const users = await usersResponse.json();
  const categories = await categoriesResponse.json();

  return { event, users, categories };
};

export const EventPage = () => {
  const { event, users, categories } = useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await fetch(`http://localhost:3000/events/${params.eventId}`, {
      method: "DELETE",
    });

    navigate("/");
    onClose();
    toast({
      title: "Event was Successfully Deleted.",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  const handleSave = async (values) => {
    try {
      const { categoryIds, ...rest } = values;
      await fetch(`http://localhost:3000/events/${params.eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rest,
          categoryIds: categoryIds,
          createdBy: parseInt(values.createdBy),
        }),
      });
      navigate("/");
      toast({
        title: "Event Updated.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error occurred.",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Center display="flex" flexDir="column">
      <Heading color="blue.600">{event.title}</Heading>

      <Flex display="flex" flexDir="column">
        <Flex
          flexDir={{ base: "column", md: "column", lg: "row" }}
          columnGap={5}
          m={{ base: "10px", md: "20px" }}
          mb="20px"
          backgroundColor="gray.100"
          borderRadius={30}
        >
          <Image
            src={event.image}
            alt={event.title}
            width={{ base: "auto" }}
            height="auto"
            borderRadius="30px"
          />
          <Flex flexDir="column" ml="5px" mt="20px" p="20px">
            <Flex flexDir="column">
              <Text title={"Event description:"} />
              {/* Text description of the event */}
              <Text
                color="rgb(30, 30, 30)"
                fontSize={{ base: "18px", md: "18px", xl: "20px" }}
                mb={{ base: "10px", md: "45px" }}
              >
                {event.description}
              </Text>
              <Text title={"Event location:"} />
              {/* Text location of the event */}
              <Text
                color="rgb(30, 30, 30)"
                fontSize={{ base: "18px", md: "18px", xl: "20px" }}
                mb={{ base: "10px", md: "15px" }}
              >
                {event.location}
              </Text>
            </Flex>
            <hr />
            <Flex flexDirection="column" mt="20px" mb="20px" rowGap={2}>
              <Text
                color="rgb(30, 30, 30)"
                fontSize={{ md: "18px", xl: "20px" }}
              >
                Start Time: {event.startTime.substring(0, 10)}{" "}
                {event.startTime.substring(11, 16)}
              </Text>
              <Text
                color="rgb(30, 30, 30)"
                fontSize={{ md: "18px", xl: "20px" }}
              >
                End Time: {event.endTime.substring(0, 10)}{" "}
                {event.endTime.substring(11, 16)}
              </Text>
            </Flex>
            <Flex flexDir="column" mb="10px" mt="20px">
              <Text title={"Category"} />
              <Flex columnGap={5}>
                {event.categoryIds.map((id) => {
                  return (
                    <Badge
                      key={id}
                      mt="10px"
                      p="10px"
                      backgroundColor="rgb(0, 51, 255)"
                      borderRadius="10px"
                      width={{ base: "auto", md: "auto", xl: "auto" }}
                      height="auto"
                      textAlign="center"
                      color="white"
                      fontSize={{ xl: "15px" }}
                      textTransform="none"
                    >
                      {categories.find((category) => category.id === id)?.name}
                    </Badge>
                  );
                })}
              </Flex>
            </Flex>
            <Flex gap={5}>
              <IconButton
                mt="1rem"
                mb="1rem"
                aria-label="Edit"
                size="md"
                icon={<EditIcon />}
                bg="green"
                color="white"
                variant="outline"
                onClick={() => setIsModalOpen(true)}
              ></IconButton>

              <IconButton
                mt="1rem"
                mb="1rem"
                color="white"
                bg="red"
                variant="outline"
                onClick={onOpen}
                aria-label="Delete"
                size="md"
                icon={<DeleteIcon />}
              ></IconButton>

              <IconButton
                mt="1rem"
                mb="1rem"
                as={Link}
                to="/"
                bg="blue"
                aria-label="Go Back"
                size="md"
                color="white"
                icon={<ArrowBackIcon />}
                variant="outline"
              />
            </Flex>
          </Flex>
        </Flex>
        {users.map((user) => {
          if (user.id === event.createdBy) {
            return (
              <Flex key={user.id} flexDir="column" alignItems="center" mt="1em">
                <Text> Event created by: {user.name}</Text>
                <Image
                  src={user.image}
                  alt={user.name}
                  width="auto"
                  mt="1em"
                  mb="1em"
                  height="90px"
                  borderRadius={{ base: "80px", md: "100px", xl: "150px" }}
                />
                <Text
                  color="rgb(30, 30, 30)"
                  fontSize={{ base: "20px", md: "30px", xl: "22px" }}
                >
                  {users.name}
                </Text>
              </Flex>
            );
          }
        })}
      </Flex>
      <AlertBox
        isOpen={isOpen}
        handleDelete={handleDelete}
        cancelRef={cancelRef}
        onClose={onClose}
      />
      <EditEventModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleSave={handleSave}
        event={event}
      />
    </Center>
  );
};
