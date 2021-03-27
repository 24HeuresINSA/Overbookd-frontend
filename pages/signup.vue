<template>
  <div>
    <h1>Sign up form</h1>
    <div>
      <ul>
        <li v-for="field in form" :key="field.title">
          <v-text-field :label="field.title" type="field.type"></v-text-field>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "signup",
  auth: false,
  data: function () {
    return {
      form: [
        { title: "first name", type: "firstname" },
        { title: "last name", type: "lastname" },
        { title: "email", type: "email" },
        { title: "phone", type: "phone" },
      ],
    };
  },
};
</script>

<style scoped></style>
