import { ReactNode } from 'react'
import { Formik, FormikConfig, FormikProps, FormikValues, Form as FormikForm } from 'formik'
import * as yup from 'yup'

export type FormProps<V extends FormikValues> = Omit<
  FormikConfig<V>,
  'children' | 'component' | 'render' | 'validationSchema'
> & {
  // form wide rules; fields can also bring their own (useFormField)
  validationSchema?: yup.ObjectSchema<Record<string, unknown>>
  children: ReactNode | ((formik: FormikProps<V>) => ReactNode)
}

export const Form = <V extends FormikValues>({ children, ...config }: FormProps<V>) => (
  <Formik<V> validateOnChange={false} {...config}>
    {(formik) => <FormikForm noValidate>{typeof children === 'function' ? children(formik) : children}</FormikForm>}
  </Formik>
)
