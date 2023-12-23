"use client";

import React from "react";
import { Formik, Form, Field, type FormikErrors } from "formik";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const router = useRouter();

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

            const id = toast.loading("Logging you in...",
            {
              isLoading: true,
              position: "top-center",
              autoClose: false,
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "dark",
            })

            actions.setSubmitting(false);
            const signInData = await signIn('credentials', {
              email: values.email,
              password: values.password,
              redirect: false,
              callbackUrl: 'http://localhost:3000/'
            });
            
            // alert(signInData);
            console.log(signInData);

            if(signInData?.ok && signInData?.url) {
              toast.update(id, 
              { 
              render: "Logging you in...", 
              type: "success", 
              isLoading: true,
              position: "top-center",
              autoClose: false,
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "dark",
              } 
              );
              router.push(signInData.url)
            } else {
              toast.update(id, 
                { 
                render: "Login Failed", 
                type: "error", 
                isLoading: false,
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                } 
                );
            }


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
      <ToastContainer 
            // position="top-center"
            // autoClose={2000}
            // hideProgressBar={false}
            // newestOnTop={false}
            // closeOnClick
            // rtl={false}
            // pauseOnFocusLoss
            // draggable
            // pauseOnHover
            // theme="dark"
          />
    </main>
  );
}
