import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: string;
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, FormValues>({
    mutationFn: async (values) => {
      const response = await fetch(
        "https://notehub-public.goit.study/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create note");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      onClose();
    },
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters long")
      .max(50, "Title can be no more than 50 characters long")
      .required("Required field"),
    content: Yup.string().max(
      500,
      "Content can be no more than 500 characters long"
    ),
    tag: Yup.string()
      .oneOf(
        ["Todo", "Work", "Personal", "Meeting", "Shopping"],
        "Select a valid tag"
      )
      .required("Required field"),
  });

  const handleSubmit = async (values: FormValues) => {
    await mutation.mutateAsync(values);
  };

  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.isLoading}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
