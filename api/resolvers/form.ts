import assert, { AssertionError } from "assert";
import { ObjectId } from "mongodb";
import requireEnv from "require-env-variable";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { isDocumentArray } from "@typegoose/typegoose";

import { Form, FormModel, UpsertForm } from "../entities/form";
import { QuestionModel } from "../entities/question";
import { IContext } from "../interfaces";
import { assertIsDefined } from "../utils";
import { ObjectIdScalar } from "../utils/ObjectIdScalar";

const { UPDATE_FORM_CREDENTIALS } = requireEnv("UPDATE_FORM_CREDENTIALS");

@Resolver(() => Form)
export class FormResolver {
  @Query(() => [Form])
  async forms(
    @Arg("show_inactive", { defaultValue: false }) show_inactive: boolean
  ) {
    if (show_inactive) {
      return await FormModel.find({});
    }
    return await FormModel.find({ active: true });
  }

  @Query(() => Form, { nullable: true })
  async form(
    @Arg("id", () => ObjectIdScalar, { nullable: true }) id?: ObjectId,
    @Arg("name", { nullable: true }) name?: string
  ) {
    if (id) {
      const formToFind = await FormModel.findById(id);
      if (!!formToFind?.active) {
        return formToFind;
      }
    } else if (name) {
      return await FormModel.findOne({
        name,
        active: true,
      });
    }
    return null;
  }

  @Mutation(() => Form)
  async toggleActiveForm(
    @Ctx() { req }: IContext,
    @Arg("form_id", () => ObjectIdScalar, { nullable: true }) form_id?: string,
    @Arg("form_name", { nullable: true })
    form_name?: string
  ) {
    assert(
      req.headers.authorization === UPDATE_FORM_CREDENTIALS,
      new AssertionError({
        message: "Not authorized!",
      })
    );
    const formToToggle = await (form_id
      ? FormModel.findById(form_id)
      : FormModel.findOne({ name: form_name }));

    assertIsDefined(formToToggle, `Form specified not found!`);
    formToToggle.active = !formToToggle.active;
    await formToToggle.save();
    return formToToggle;
  }

  @Mutation(() => Form)
  async upsertForm(
    @Ctx() { req }: IContext,
    @Arg("data") { _id, name, questions }: UpsertForm
  ) {
    assert(
      req.headers.authorization === UPDATE_FORM_CREDENTIALS,
      new AssertionError({
        message: "Not authorized!",
      })
    );
    if (_id) {
      const form = await FormModel.findByIdAndUpdate(
        _id,
        {
          name,
          questions,
          active: true,
        },
        {
          new: true,
          upsert: true,
        }
      );

      assertIsDefined(form, `Form not found!`);

      return form;
    } else {
      let formToUpsert = await FormModel.findOne({
        name,
      });
      if (formToUpsert === null) {
        formToUpsert = await FormModel.create({
          name,
          questions,
          active: true,
        });
      } else {
        formToUpsert.name = name;
        formToUpsert.questions = questions;
        await formToUpsert.save();
      }

      return formToUpsert;
    }
  }

  @FieldResolver()
  async questions(@Root() { questions }: Partial<Form>) {
    if (questions) {
      if (isDocumentArray(questions)) {
        return questions;
      }
      return QuestionModel.find({
        _id: {
          $in: questions,
        },
      });
    }
    return [];
  }
}
