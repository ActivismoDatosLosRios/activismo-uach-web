import { format } from "date-fns";
import esLocale from "date-fns/locale/es";
import { map } from "lodash";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LazyLoad from "react-lazyload";
import { useWindowSize } from "react-use";
import { Checkbox } from "semantic-ui-react";
import zenscroll from "zenscroll";

import { useQuery } from "@apollo/react-hooks";
import { Badge, Box, Flex, Image, Stack, Tag, Text } from "@chakra-ui/core";

import { GET_CHARTS } from "../../graphql/queries";

let scrollDuration = 10000;

function toUp({ height }: { height: number }) {
  setTimeout(() => {
    zenscroll.toY(0, scrollDuration * 2, () => {
      toDown({ height });
    });
  }, 1000);
}
function toDown({ height }: { height: number }) {
  setTimeout(() => {
    zenscroll.toY(height, scrollDuration * 3, () => {
      toUp({ height });
    });
  }, 1000);
}
const IndexPage: NextPage = () => {
  const { data, loading, error } = useQuery(GET_CHARTS, {
    pollInterval: 5000,
  });

  const {
    query: { scrollPage },
  } = useRouter();

  const { height } = useWindowSize();

  useEffect(() => {
    scrollDuration = height * 10;
  }, [height]);

  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    if (scroll) {
      zenscroll.stop();
      toDown({ height: height + window.pageYOffset });
    } else {
      zenscroll.stop();
    }
  }, [scroll, height]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || error) {
    return <>{error?.message ?? "No data available, please check later"}</>;
  }

  return (
    <>
      {scrollPage && (
        <Box pos="fixed" bottom={0} left={0}>
          <Checkbox
            toggle
            checked={scroll}
            onChange={() => setScroll(scroll => !scroll)}
          />
        </Box>
      )}
      <Stack alignItems="center">
        {map(data.charts, (chart, key) => {
          return (
            <Flex
              direction="column"
              borderWidth="2px"
              rounded="lg"
              key={key}
              border="1px"
              borderColor="gray.400"
              justifyContent="space-between"
              pt={0}
              boxShadow="2px 1px #A0AEC0"
              maxW="100%"
            >
              <Flex
                alignItems="center"
                justifyContent="space-between"
                borderBottom="1px"
                borderBottomColor="gray.300"
                pl={6}
                pr={6}
                pt={3}
                pb={3}
              >
                <Tag variant="outline" pl={4} pr={4} rounded="md">
                  <Text fontWeight="semibold" color="black">
                    {chart.title}
                  </Text>
                </Tag>
                <Stack
                  flexWrap="wrap"
                  isInline
                  justifyContent="space-between"
                  key="stack"
                >
                  {map(chart.tags, (tag, key) => {
                    return (
                      <Badge
                        key={key}
                        rounded="lg"
                        variant="solid"
                        px="2"
                        backgroundColor="green.400"
                        m={1}
                      >
                        <Text color="white" fontWeight="semibold" key={key}>
                          {tag}
                        </Text>
                      </Badge>
                    );
                  })}
                </Stack>
              </Flex>
              <LazyLoad height={300} once>
                <Image
                  p={6}
                  objectFit="contain"
                  key={key}
                  src={`/api${chart.imageUrl}`}
                />
              </LazyLoad>
              <Flex p={3}>
                <Text>
                  {format(new Date(chart.updatedAt), "PPPPpppp", {
                    locale: esLocale,
                  })}
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </Stack>
    </>
  );
};

export default IndexPage;
