"use client";

import React from "react";
import { useState } from "react";
import { Formik, Form, Field, type FormikErrors } from "formik";

import { api } from "@/trpc/react";

interface MyFormValues {
  username: string;
  email: string;
  password: string;
  confirmpassword: string;
}

export default function SignUpForm() {
  const initialValues: MyFormValues = {
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  };

  const [long, setLong] = useState(false);
  const [number, hasNumber] = useState(false);  

  const newUser = api.user.createUser.useMutation({
    onSuccess(data) {
      alert(JSON.stringify(data?.email))
    },
  });

  return (
    <main className="">
      <div className="">
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors: FormikErrors<MyFormValues> = {};

            values.password.length < 8 ? setLong(false) : setLong(true);
            !/\d/.test(values.password) ? hasNumber(false) : hasNumber(true);

            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }

            if (!values.username) {
              errors.username = "Required";
            }

            if (values.password.length < 8) {
              errors.password = "Password must be minimum 8 characters long";
            }

            if (!/\d/.test(values.password)) {
              errors.password = "Password must contain at least 1 number";
            }

            if (!values.confirmpassword) {
              errors.confirmpassword = "Required";
            }

            if (values.confirmpassword !== values.password) {
              errors.confirmpassword = "Does not match with password above";
            }

            return errors;
          }}
          onSubmit={(values, actions) => {
            // console.log({ values, actions });
            // alert(JSON.stringify(values, null, 2));

            newUser.mutate({
              username: values.username,
              email: values.email,
              password: values.password
            })            

            // alert(JSON.stringify(user));

            actions.resetForm();
            actions.setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <div className="grid justify-center items-center">
              <Form className="flex flex-col gap-3 p-4 w-[650px] bg-[#2d2d2d] rounded-xl">
                <label htmlFor="name" className="text-white">
                  Name
                </label>
                <Field
                  id="username"
                  name="username"
                  placeholder="Name"
                  className="text-black p-3 rounded-lg"
                />
                {errors.username && touched.username && (
                  <p className="text-red-500"> {errors.username} </p>
                )}

                <label htmlFor="email" className="text-white">
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="text-black p-3 rounded-lg"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500"> {errors.email} </p>
                )}
                <label htmlFor="password" className="text-white">
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  className="text-black p-3 rounded-lg"
                />
                {!long && (
                  <>
                    <p className=" text-red-500">
                      Password Must be minimum 8 Character Long
                    </p>
                  </>
                )}
                {!number && (
                  <>
                    <p className=" text-red-500">
                      Password Must contain atleast 1 Number
                    </p>
                  </>
                )}

                <label htmlFor="password" className="text-white">
                  Confirm Password
                </label>
                <Field
                  id="confirmpassword"
                  name="confirmpassword"
                  placeholder="Confirm Password"
                  type="password"
                  className="text-black p-3 rounded-lg"
                />
                {errors.confirmpassword && touched.confirmpassword && (
                  <p className="text-red-500"> {errors.confirmpassword} </p>
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
