<template>
  <v-app>
    <navigation-app-bar></navigation-app-bar>
    <navigation-menu></navigation-menu>
    <v-main fill-height fluid>
      <v-container fill-height fluid>
        <nuxt />
      </v-container>
    </v-main>
    <navigation-footer></navigation-footer>
  </v-app>
</template>

<script>
export default {};
</script>
