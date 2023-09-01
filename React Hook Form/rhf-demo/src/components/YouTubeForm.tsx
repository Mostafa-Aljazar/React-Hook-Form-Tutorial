import React, { useEffect } from "react";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import axios from "axios";

let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    facebook: string;
    twitter: string;
  };
  phones: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  dob: Date;
};

export const YouTubeForm = () => {

  const form = useForm<FormValues>({
    defaultValues: async () => {
      const res = await axios.get(
        "https://jsonplaceholder.typicode.com/users/1"
      );
      const data = await res.data;

      return {
        username: data?.username || "Codevolution",
        email: "m1@gmail.com",
        channel: "channel",
        social: {
          facebook: "facebook",
          twitter: "twitter",
        },
        phones: ["Primary", "Secondary"],
        phNumbers: [{ number: "phone number 0" }],
        age: 0,
        dob: new Date(),

      };
    },
    mode: "onChange"//onSubmit , onChange ,...
  });

  const { register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
    trigger,
  } = form;


  const { errors, dirtyFields, touchedFields, isDirty, isValid, isSubmitted, isSubmitting, isSubmitSuccessful, submitCount } = formState;

  // console.log("dirtyFields => ", dirtyFields)
  // console.log("touchedFields => ", touchedFields)
  // console.log("isDirty => ", isDirty)

  // console.log("isSubmitted => ", isSubmitted)
  // console.log("isSubmitting => ", isSubmitting)
  // console.log("isSubmitSuccessful => ", isSubmitSuccessful)
  // console.log("submitCount => ", submitCount)

  // Add rules object..
  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
    rules: {
      required: {
        value: true,
        message: "Phone number field is required.",
      },
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("form submitted", data);
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("form errors", errors);
  };

  const handelGetValues = () => {
    console.log("Get All Values", getValues());
    console.log("Get phNumbers Values", getValues("phNumbers"));
    console.log("Get phNumbers", "username Values", getValues(["phNumbers", "username"]));
  };

  const handelSetValues = () => {
    setValue("username", "Sama",
      {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      })
  };


  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful])

  // const watchAll = watch();
  const watchUserName = watch("username");


  renderCount++;
  return (
    <div>
      <h1>YouTube Form {renderCount / 2}</h1>

      {/* ----------------------------------------------------- */}

      <form onSubmit={handleSubmit(onSubmit, onError)}>

        {/* <h3>Watched All value: {JSON.stringify(watchAll)}</h3> */}
        <h3>Watched username value: {JSON.stringify(watchUserName)}</h3>

        {/* ----------------------------------------------------- */}

        {/* username */}
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", {
              disabled: true,
              required: {
                value: true,
                message: "username is required",
              },
              validate: (fieldValue) => {
                return isNaN(+fieldValue)
                  ? true
                  : "username shouold not be number";
              },
            })}
          />
          <p className="error">{errors.username?.message}</p>
        </div>

        {/* ----------------------------------------------------- */}

        {/*Async Validation, validate, pattern =>  email */}
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
              validate: {
                NotAdmin: (fieldValue) => {
                  return (
                    fieldValue !== "admin@example.com" ||
                    "Enter different email address"
                  );
                },
                NotBlackList: (fieldValue) => {
                  return fieldValue.endsWith("org")
                    ? "This domain is not supported"
                    : true;
                },
                Empty: (fieldValue) => {
                  return fieldValue == ""
                    ? "email field should not be empty"
                    : true;
                },
                ValidateEmail: async (fieldValue) => {
                  const res = await axios.get(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`)
                  const data = await res.data
                  console.log(data)
                  return data.length == 0 || "Email already exists"
                }
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        {/* ----------------------------------------------------- */}

        {/* channel */}
        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register("channel", {
              required: { value: true, message: "channel name is required" },
            })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>

        {/* ----------------------------------------------------- */}

        {/* facebook */}
        <div className="form-control">
          <label htmlFor="facebook">facebook</label>
          <input
            type="text"
            id="facebook"
            {...register("social.facebook", {
              required: { value: true, message: "facebook name is required" },
            })}
          />
          <p className="error">{errors.social?.facebook?.message}</p>
        </div>

        {/* ----------------------------------------------------- */}

        {/* twitter */}
        <div className="form-control">
          <label htmlFor="twitter">twitter</label>
          <input
            type="text"
            id="twitter"
            {...register("social.twitter", {
              disabled: watch('channel') == "",
              required: { value: true, message: "twitter name is required" },
            })}
          />
          <p className="error">{errors.social?.twitter?.message}</p>
        </div>

        {/* ----------------------------------------------------- */}

        {/* primary-phone */}
        <div className="form-control">
          <label htmlFor="primary-phone">Primary phone</label>
          <input
            type="text"
            id="primary-phone"
            {...register("phones.0", {
              required: { value: true, message: "Primary phone is required" },
            })}
          />
          <p className="error">{errors.phones?.[0]?.message}</p>
        </div>

        {/* ----------------------------------------------------- */}

        {/* secondary-phone */}
        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary phone</label>
          <input
            type="text"
            id="secondary-phone"
            {...register("phones.1", {
              required: { value: true, message: "Secondary phone is required" },
            })}
          />
          <p className="error">{errors.phones?.[1]?.message}</p>
        </div>

        {/* ----------------------------------------------------- */}

        {/* Dynamic Fields => List of phone numbers => using remove , append */}
        <div>
          <label>List of phone numbers</label>
          <div>
            {fields.map((field, index) => {
              return (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number` as const, {
                      required: {
                        value: true,
                        message: `Phone number ${index} field is required`,
                      },
                    })}
                  />
                  {index > 0 && (
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  )}

                  {/* Show field error .... */}
                  <p className="error">
                    {errors.phNumbers?.[index]?.number?.message}
                  </p>
                </div>
              );
            })}
            <button type="button" onClick={() => append({ number: "" })}>
              Add phone enumber
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------- */}

        {/*  valueAsNumber: true => age */}
        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            {...register("age", {
              valueAsNumber: true,
              required: { value: true, message: "age is required" },
            })}
          />
          <p className="error">{errors.age?.message}</p>
        </div>

        {/* ----------------------------------------------------- */}

        {/*  valueAsDate: true => dob */}
        <div className="form-control">
          <label htmlFor="dob">Date of brith Day</label>
          <input
            type="date"
            id="dob"
            {...register("dob", {
              valueAsDate: true,
              required: { value: true, message: "DOB is required" },
            })}
          />
          <p className="error">{errors.dob?.message}</p>
        </div>

        {/* ----------------------------------------------------- */}

        <button disabled={!isDirty && !isValid}>Submit</button>

        <button type="button" onClick={handelGetValues}>Get Values</button>
        <button type="button" onClick={handelSetValues}>Set Values</button>
        <button type="button" onClick={() => reset()}>Reset</button>{/* //reset("channel") */}

        <button type="button" onClick={() => trigger()}>Validate</button>{/* //trigger("channel") */}

        {/* ----------------------------------------------------- */}
      </form>
      {/* ----------------------------------------------------- */}

      <DevTool control={control} />
    </div>
  );
};
