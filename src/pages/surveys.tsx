import { map } from "lodash";
import { NextPage } from "next";
import Router from "next/router";

import { useQuery } from "@apollo/react-hooks";
import { Box, Flex, Stack, Tag, Text } from "@chakra-ui/core";

import { GET_ALL_FORMS } from "../graphql/queries";

const SurveysPage: NextPage = () => {
  const { data } = useQuery(GET_ALL_FORMS);

  return (
    <Stack className="survey_stack_box" align="center">
      <Flex justifyContent="center" pt={4} pb={4}>
        <Box
          width={["95%", "70%"]}
          textAlign="justify"
          whiteSpace="pre-wrap"
          border="1px solid"
          borderColor="grey"
          p={5}
        >
          <Text fontSize="lg">
            A continuación encontrará una lista de encuestas, las cuales podrá
            responder según sean sus intereses.
          </Text>
          <Text fontSize="lg">
            Un grupo de cientistas de datos realizará un análisis inmediato de
            los resultados en la plaza de la República de Valdivia, el día
            sábado 14 de diciembre desde las 15hrs. Esperamos y agradecemos
            contar con la mayor participación tanto en las encuestas como en el
            análisis de los datos en vivo.
          </Text>
          <Text fontSize="sm">
            Activismo de datos, Los Ríos,{" "}
            <a href="mailto: activismodatos@inf.uach.cl">
              activismodatos@inf.uach.cl
            </a>
            .
          </Text>
        </Box>
      </Flex>
      {map(data?.forms ?? [], ({ _id, name }) => {
        return (
          <Tag
            className="survey_button"
            key={_id}
            cursor="pointer"
            justifyContent="center"
            onClick={() => {
              Router.push("/survey/[id]", `/survey/${_id}`);
            }}
            textAlign="center"
            width={["90%", "40em"]}
          >
            {name}
          </Tag>
        );
      })}
    </Stack>
  );
};

export default SurveysPage;
