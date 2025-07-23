<script setup>
import * as yup from 'yup';
import { useForm } from 'vee-validate';

const schema = yup.object({
  email: yup.string().required().email().label('Email address'),
  fullName: yup.string().required().label('Full name'),
  password: yup.string().required().min(6).label('Password'),
  passwordConfirm: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .label('Password confirmation'),
  terms: yup
    .boolean()
    .required()
    .isTrue('You must agree to terms and conditions')
    .label('terms agreement'),
  type: yup.string().required().label('Account type'),
});

const { defineField, handleSubmit, resetForm, errors, values } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
    fullName: '',
    passwordConfirm: '',
    type: '',
    terms: false,
  },
});

const naiveConfig = (state) => ({
  props: {
    validationStatus: state.errors[0] ? 'error' : undefined,
    feedback: state.errors[0],
  },
});

const [fullName, fullNameProps] = defineField('fullName', naiveConfig);
const [email, emailProps] = defineField('email', naiveConfig);
const [password, passwordProps] = defineField('password', naiveConfig);
const [passwordConfirm, passwordConfirmProps] = defineField(
  'passwordConfirm',
  naiveConfig
);
const [terms, termsProps] = defineField('terms', naiveConfig);
const [type, typeProps] = defineField('type', naiveConfig);

const onSubmit = handleSubmit((values) => {
  console.log('Submitted with', values);
});

const options = ['Enterprise', 'Pro', 'Freelance'].map((t) => ({
  label: t,
  value: t,
}));
</script>

<template>
  <n-form>
    <n-form-item path="fullName" label="Full name" v-bind="fullNameProps">
      <n-input v-model:value="fullName" />
    </n-form-item>

    <n-form-item path="email" label="Email" v-bind="emailProps">
      <n-input v-model:value="email" type="email" />
    </n-form-item>

    <n-form-item path="password" label="Password" v-bind="passwordProps">
      <n-input v-model:value="password" type="password" />
    </n-form-item>

    <n-form-item
      path="passwordConfirm"
      label="Password confirmation"
      v-bind="passwordConfirmProps"
    >
      <n-input v-model:value="passwordConfirm" type="password" />
    </n-form-item>

    <n-form-item path="type" label="Account type" v-bind="typeProps">
      <n-select v-model:value="type" :options="options" />
    </n-form-item>

    <n-form-item path="terms" label="" v-bind="termsProps">
      <n-checkbox v-model:checked="terms">
        I agree to terms and conditions
      </n-checkbox>
    </n-form-item>

    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; gap: 4px">
          <n-button round type="primary" @click="onSubmit"> Submit </n-button>
          <n-button round type="secondary" @click="resetForm()">
            Reset
          </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>
</template>
