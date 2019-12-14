import { uniq } from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import { useRememberState } from "use-remember-state";

import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Box,
  Button,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/core";

import { GET_TAGS, UPLOAD_CHART } from "../../graphql/queries";

export default () => {
  const { data: allTags } = useQuery(GET_TAGS);

  const [authorization, setAuthorization] = useRememberState<string>(
    "authorization-upload-chart",
    ""
  );
  const [title, setTitle] = useState<string>("");
  const [oldTitle, setOldTitle] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<
    { value: string; text: string }[]
  >([]);
  const [file, setFile] = useState<File>();
  const [uploadChart, { data, loading, error }] = useMutation(UPLOAD_CHART, {
    context: {
      headers: {
        authorization,
      },
    },
  });
  useEffect(() => {
    if (allTags) {
      setTagOptions(tagOptions =>
        uniq([
          ...tagOptions,
          ...allTags.tags.map(value => ({ value, text: value })),
        ])
      );
    }
  }, [allTags, setTagOptions]);

  const [hideAuthorization, setHideAuthorization] = useState(true);

  useEffect(() => {
    if (!hideAuthorization) {
      setTimeout(() => {
        setHideAuthorization(true);
      }, 2000);
    }
  }, [hideAuthorization, setHideAuthorization]);

  return (
    <Stack spacing="20px">
      {error && (
        <>
          <h3>Error!</h3>
          <ul>
            {error.graphQLErrors.map(({ message }, key) => (
              <p key={key}>{message}</p>
            ))}
          </ul>
        </>
      )}
      <InputGroup size="sm" borderColor="gray.400" alignItems="center">
        <InputLeftAddon rounded="md" size="md">
          <Text>Authorization Token</Text>
        </InputLeftAddon>
        <Input
          size="lg"
          variant="outline"
          rounded="md"
          placeholder="token"
          isRequired
          type={hideAuthorization ? "password" : "text"}
          value={authorization}
          onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
            setAuthorization(value);
          }}
        />
        <InputRightElement>
          <IconButton
            cursor="pointer"
            aria-label="show-authorization"
            icon={hideAuthorization ? "view" : "view-off"}
            onClick={() => {
              setHideAuthorization(hide => !hide);
            }}
          />
        </InputRightElement>
      </InputGroup>
      <InputGroup size="sm" borderColor="gray.400" alignItems="center">
        <InputLeftAddon rounded="md" size="md">
          <Text>Old Title (leave blank if creating a new chart)</Text>
        </InputLeftAddon>
        <Input
          size="lg"
          variant="outline"
          rounded="md"
          placeholder=""
          isRequired
          value={oldTitle}
          onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
            setOldTitle(value);
          }}
        />
      </InputGroup>
      <InputGroup size="sm" borderColor="gray.400" alignItems="center">
        <InputLeftAddon rounded="md" size="md">
          <Text>Title</Text>
        </InputLeftAddon>
        <Input
          size="lg"
          variant="outline"
          rounded="md"
          placeholder="Chart Title"
          isRequired
          value={title}
          onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
            setTitle(value);
          }}
        />
      </InputGroup>
      <Box>
        <Dropdown
          value={tags}
          onChange={(_e, { value }) => {
            setTags(value as string[]);
          }}
          multiple
          options={tagOptions}
          allowAdditions
          selection
          search
          fluid
          additionLabel="Create tag "
          placeholder="Add tags"
          onAddItem={(_e, { value }: any) => {
            setTagOptions(tags => [...tags, { value, text: value }]);
            setTags([...tags, value]);
          }}
          noResultsMessage="No tags"
        />
      </Box>
      <Box>
        <input
          type="file"
          onChange={({
            target: { validity, files },
          }: ChangeEvent<HTMLInputElement>) => {
            if (files && validity.valid) {
              setFile(files[0]);
            }
          }}
        />
      </Box>
      <Button
        isDisabled={!file}
        onClick={() => {
          if (file) {
            uploadChart({
              variables: {
                file,
                data: {
                  title,
                  tags,
                },
                oldTitle: oldTitle || undefined,
              },
            });
          }
        }}
      >
        Upsert Chart
      </Button>
      {data && (
        <Stack>
          <Box>
            <Text textAlign="center">{data.uploadChart.title}</Text>
          </Box>
          <Image objectFit="contain" src={`/api${data.uploadChart.imageUrl}`} />
        </Stack>
      )}
    </Stack>
  );
};
