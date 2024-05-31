import { Center, Skeleton, useDisclosure, useToast } from "@chakra-ui/react";
import {
  Heading,
  Text,
  Flex,
  Box,
  Image,
  Button,
  Badge,
} from "@chakra-ui/react";
import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import AddNewEventModal from "../components/EventFormModal";
import { useState } from "react";

import Filter from "../components/Filter";

export const loader = async () => {
  try {
    const baseUrl = "http://localhost:3000";
    const eventsUrl = new URL("/events", baseUrl);
    const categoriesUrl = new URL("/categories", baseUrl);

    const [eventsResponse, categoriesResponse] = await Promise.all([
      fetch(eventsUrl),
      fetch(categoriesUrl),
    ]);

    const events = await eventsResponse.json();
    const categories = await categoriesResponse.json();

    return { events, categories };
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    throw error;
  }
};
export const EventsPage = () => {
  const { events, categories } = useLoaderData();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const isLoading = !events || !categories;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const categoryIdsFilter = searchParams.getAll("categoryIds");

  const filteredEvents = categoryIdsFilter.length
    ? events.filter((event) =>
        categoryIdsFilter.every(
          (categoryId) =>
            event.categoryIds &&
            event.categoryIds.includes(parseInt(categoryId))
        )
      )
    : events;

  const handleCreate = async (values) => {
    const { categoryIds, ...rest } = values;
    try {
      const response = await fetch(`http://localhost:3000/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rest,
          categoryIds: categoryIds,
          createdBy: parseInt(values.createdBy),
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      onClose();
      navigate("/");
      toast({
        title: "Event Created!",
        description: "The Event has been created successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error(`Error: ${error}`);
      toast({
        title: "Error occurred.",
        description: error.message || "Something went wrong. Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };
  if (isLoading) {
    return (
      <div>
        <Skeleton height="20px" mb="2rem" />
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} height="300px" mb="1.5rem" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <Center>
        <Heading mt="2rem" ml="3%" color="blue.600">
          Events App
        </Heading>
      </Center>
      <Center>
        <Filter
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setSearchParams={setSearchParams}
        />
        <Button
          mt="2rem"
          color="white"
          bg={"orange.300"}
          variant="outline"
          onClick={onOpen}
          className="add-new-event-button"
        >
          Add New Event
        </Button>
      </Center>

      <Flex
        flexDir={{ base: "column", md: "row" }}
        wrap="wrap"
        basis="40px"
        grow="1"
        shrink="0"
        columnGap={{ base: "2", sm: "2", md: "4", lg: "8" }}
        m="30px"
        justify="center"
      >
        {filteredEvents
          .filter(
            (event) =>
              searchValue.toLowerCase() === "" ||
              Object.values(event)
                .join("")
                .toLowerCase()
                .includes(searchValue.toLowerCase())
          )

          .map((event) => (
            <Flex
              backgroundColor="gray.100"
              flexDirection={{ base: "column" }}
              marginBottom="30px"
              borderTopRadius="20px"
              borderBottomRadius="20px"
              maxWidth="300px"
              flexBasis="300px"
              grow="1"
              shrink="0"
              _hover={{ boxShadow: "0 20px 40px rgba(33,33,33,0.25)" }}
              transition="box-shadow .3s"
              key={event.id}
            >
              <Link to={`event/${event.id}`}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  rowGap={2}
                >
                  <Image
                    src={event.image}
                    alt=""
                    width="auto"
                    height={300}
                    borderTopRadius="20px"
                    mb="10px"
                  />
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    p="1em"
                  >
                    <Text
                      color="rgb(30, 30, 30)"
                      fontWeight="semibold"
                      mb="10px"
                      justifyContent={"right"}
                      textAlign="right"
                    >
                      {event.location}
                    </Text>
                    <Heading fontSize="18px" fontWeight="bold" color="blue.600">
                      {event.title}
                    </Heading>
                    <Text
                      color="blue.600"
                      fontWeight="regular"
                      fontSize="15px"
                      m="10px"
                    >
                      {" "}
                      {event.description}
                    </Text>
                    <Box color="rgb(30, 30, 30)">
                      Start Time: {event.startTime.substring(0, 10)}{" "}
                      {event.startTime.substring(11, 16)}
                    </Box>
                    <Box color="rgb(30, 30, 30)">
                      End Time: {event.endTime.substring(0, 10)}{" "}
                      {event.endTime.substring(11, 16)}
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      columnGap="10px"
                      mb="10px"
                      mt="5px"
                    >
                      {event.categoryIds.map((id) => {
                        return (
                          <Badge
                            key={id}
                            mt={{ base: "20px" }}
                            p="10px"
                            color="white"
                            backgroundColor="rgb(0, 51, 255)"
                            borderRadius="10px"
                            textTransform="none"
                            _hover={{ background: "rgb(11, 19, 189)" }}
                          >
                            {
                              categories.find((category) => category.id === id)
                                ?.name
                            }
                          </Badge>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              </Link>
            </Flex>
          ))}
      </Flex>
      <AddNewEventModal
        handleCreate={handleCreate}
        isOpen={isOpen}
        onClose={onClose}
      />
    </div>
  );
};
