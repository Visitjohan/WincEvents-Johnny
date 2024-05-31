import { Button, Input, Box } from "@chakra-ui/react";

export default function Filter({
  searchValue,
  setSearchValue,
  setSearchParams,
}) {
  return (
    <Box gap="100px">
      <Box>
        <label>
          <Input
            type="search"
            placeholder="Search for Events"
            mt="2rem"
            mb="2rem"
            w={["100%"]}
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </label>
      </Box>

      <Box>
        {[
          { label: "All", categoryIds: [] },
          { label: "Sports", categoryIds: [1] },
          { label: "Games", categoryIds: [2] },
          { label: "Relaxation", categoryIds: [3] },
        ].map(({ label, categoryIds }) => (
          <Button
            key={label}
            color={"white"}
            bgColor={"blue.600"}
            variant="outline"
            m=".2rem"
            onClick={() => setSearchParams({ categoryIds })}
          >
            {label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
