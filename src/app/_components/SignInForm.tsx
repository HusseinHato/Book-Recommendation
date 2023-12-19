"use client";

import React from "react";
import { Formik, Form, Field, type FormikErrors } from "formik";
import { signIn } from "next-auth/react";

interface MyFormValues {
  email: string;
  password: string;
}

export default function SignInForm() {

//   const router = useRouter();

  const initialValues: MyFormValues = {
    email: "",
    password: "",
  };

  return (
    <main className="">
      <div className="">
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors: FormikErrors<MyFormValues> = {};

            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }

            if (!values.password) {
              errors.password = "Password must be minimum 8 characters long";
            }

            return errors;
          }}
          onSubmit = { async (values, actions) => {
            // console.log({ values, actions });
            // alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
            await signIn('credentials', {
              email: values.email,
              password: values.password,
              redirect: true,
              callbackUrl: 'http://localhost:3000/dashboard'
            });
            
            // alert(signInData);
            // console.log(signInData);


            // if(signInData?.error){
            //   // console.log(error);
            //   console.log("Auth Failed")
            // }else {
            //   router.push('/dashboard')
            // }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <div className="grid justify-center items-center">
              <Form className="flex flex-col gap-3 p-4 w-[650px] bg-[#2d2d2d] rounded-xl">
                <label htmlFor="email" className="text-white">Email</label>
                <Field
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="text-black p-3 rounded-lg"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500"> {errors.email} </p>
                )}
                <label htmlFor="password" className="text-white">Password</label>
                <Field
                  id="password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  className="text-black p-3 rounded-lg"
                />
                {errors.password && touched.password && (
                  <p className="text-red-500"> {errors.password} </p>
                )}
                <button
                  type="submit"
                  className="bg-[#006fff] text-white hover:bg-[#69b4ff] p-3 rounded-lg"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </main>
  );
}
