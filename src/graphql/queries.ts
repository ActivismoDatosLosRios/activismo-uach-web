import gql, { DocumentNode } from "graphql-tag-ts";

export const GET_CHARTS: DocumentNode<{
  charts: {
    title: string;
    imageUrl: string;
    tags: string[];
    updatedAt: Date;
  }[];
}> = gql`
  query {
    charts {
      title
      imageUrl
      tags
      updatedAt
    }
  }
`;

export const UPLOAD_CHART: DocumentNode<
  {
    uploadChart: { imageUrl: string; title: string };
  },
  {
    file: File;
    data: { title: string; tags?: string[] };
    oldTitle?: string;
  }
> = gql`
  mutation($file: Upload!, $data: ChartUpload!, $oldTitle: String) {
    uploadChart(file: $file, data: $data, oldTitle: $oldTitle) {
      title
      imageUrl
    }
  }
`;

export const GET_TAGS: DocumentNode<{
  tags: string[];
}> = gql`
  query {
    tags
  }
`;

export const GET_ALL_FORMS: DocumentNode<{
  forms: { _id: string; name: string }[];
}> = gql`
  query {
    forms {
      _id
      name
    }
  }
`;

export const GET_FORM: DocumentNode<
  {
    form?: {
      _id: string;
      name: string;
      questions: { _id: string; text: string; alternatives?: string[] }[];
    };
  },
  {
    id: string;
  }
> = gql`
  query($id: ObjectId!) {
    form(id: $id) {
      _id
      name
      questions {
        _id
        text
        alternatives
      }
    }
  }
`;

export const UPSERT_FORM: DocumentNode<
  {
    upsertForm: {
      _id: string;
    };
  },
  {
    data: {
      _id?: string;
      name: string;
      questions: string[];
    };
  }
> = gql`
  mutation($data: UpsertForm!) {
    upsertForm(data: $data) {
      _id
    }
  }
`;

export const UPSERT_QUESTION: DocumentNode<
  {
    upsertQuestion: {
      _id: string;
    };
  },
  {
    data: {
      _id?: string;
      text: string;
      alternatives?: string[] | null;
    };
  }
> = gql`
  mutation($data: UpsertQuestion!) {
    upsertQuestion(data: $data) {
      _id
    }
  }
`;

export const GET_QUESTIONS: DocumentNode<{
  questions: {
    _id: string;
    text: string;
    alternatives?: string[];
    createdAt: Date;
    updatedAt: Date;
  }[];
}> = gql`
  query {
    questions {
      _id
      text
      alternatives
      updatedAt
      createdAt
    }
  }
`;

export const GET_FORMS: DocumentNode<{
  forms: {
    _id: string;
    name: string;
    questions: {
      _id: string;
      text: string;
      alternatives?: string[];
      createdAt: Date;
      updatedAt: Date;
    }[];
    updatedAt: Date;
    createdAt: Date;
    active: boolean;
  }[];
}> = gql`
  query {
    forms(show_inactive: true) {
      _id
      name
      questions {
        _id
        text
        alternatives
        updatedAt
        createdAt
      }
      updatedAt
      createdAt
      active
    }
  }
`;

export const ANSWER_FORM: DocumentNode<
  {
    answerForm: {
      _id: string;
    };
  },
  {
    data: {
      form: string;
      latitude: number;
      longitude: number;
      answers: {
        question: string;
        answer: string;
      }[];
    };
  }
> = gql`
  mutation($data: FormResultInput!) {
    answerForm(data: $data) {
      _id
    }
  }
`;

export const TOGGLE_ACTIVE_FORM: DocumentNode<
  {
    toggleActiveForm: {
      _id: string;
    };
  },
  {
    form_name: string;
  }
> = gql`
  mutation($form_name: String) {
    toggleActiveForm(form_name: $form_name) {
      _id
    }
  }
`;
