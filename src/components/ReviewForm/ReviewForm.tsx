import {
  Banner,
  Button,
  Card,
  ContextualSaveBar,
  Form,
  FormLayout,
  Layout,
  Select,
  TextField,
} from "@shopify/polaris";
import {
  lengthMoreThan,
  notEmpty,
  useField,
  useForm,
} from "@shopify/react-form";
import React from "react";
import { ReviewFormType } from "../../types/review";

type Props = {
  onSubmit: (form: ReviewFormType) => Promise<void>;
};

export const ReviewForm: React.FC<Props> = ({ onSubmit }) => {
  const { fields, submit, submitErrors, submitting, dirty, reset } = useForm({
    fields: {
      name: useField({
        value: "Debug User",
        validates: [
          notEmpty("Name is required."),
          lengthMoreThan(3, "Name must be more than 3 characters"),
        ],
      }),
      email: useField({
        value: "debug@email.com",
        validates: [notEmpty("Email is required.")],
      }),
      rating: useField({
        value: "5",
        validates: [],
      }),
      reviewTitle: useField({
        value: "Life changing.",
        validates: [
          notEmpty("Review title is required."),
          lengthMoreThan(3, "Review title must be more than 3 characters"),
        ],
      }),
      reviewBody: useField({
        value:
          "Tiramisu cotton candy cotton candy cotton candy. Icing jelly jelly beans. Jelly-o caramels gummi bears gingerbread. Sesame snaps wafer topping apple pie lollipop caramels. Liquorice jelly beans candy. Icing jujubes cotton candy cake pastry carrot cake gingerbread. Bear claw bonbon liquorice biscuit chocolate cake tart sweet",
        validates: [
          notEmpty("Review body is required."),
          lengthMoreThan(3, "Review body must be more than 3 characters"),
        ],
      }),
    },
    onSubmit: async (form) => {
      console.log(form);
      await onSubmit(form);
      return { status: "success" };
    },
  });

  return (
    <Form onSubmit={submit}>
      {dirty && (
        <ContextualSaveBar
          message="Unsaved Review..."
          saveAction={{
            onAction: submit,
            loading: submitting,
            disabled: false,
          }}
          discardAction={{
            onAction: reset,
          }}
        />
      )}
      <Layout>
        {submitErrors.length > 0 && (
          <Layout.Section>
            <Banner status="critical">
              <p>There were some issues with your form submission:</p>
              <ul>
                {submitErrors.map(({ message }, index) => (
                  <li key={`${message}-${index}`}>{message}</li>
                ))}
              </ul>
            </Banner>
          </Layout.Section>
        )}
        <Layout.Section>
          <Card>
            <Card.Section>
              <FormLayout>
                <FormLayout.Group>
                  <TextField
                    autoComplete="false"
                    label="Name"
                    {...fields.name}
                  />
                  <TextField
                    autoComplete="false"
                    label="Email"
                    {...fields.email}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="Rating"
                    options={[...Array(5)].map((_, i) => ({
                      label: "⭐️".repeat(i + 1),
                      value: String(i + 1),
                    }))}
                    {...fields.rating}
                  />
                </FormLayout.Group>
                <TextField
                  autoComplete="false"
                  label="Review Title"
                  {...fields.reviewTitle}
                />
                <TextField
                  autoComplete="false"
                  label="Review Body"
                  {...fields.reviewBody}
                />
                <Button primary submit loading={submitting}>
                  Create Review
                </Button>
              </FormLayout>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Form>
  );
};
