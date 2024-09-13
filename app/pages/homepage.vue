<template>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <div class="text-center">
    <div>
      <v-btn
        class="ma-2"
        color="primary"
      >
        Accept
        <v-icon
          icon="mdi-checkbox-marked-circle"
          end
        ></v-icon>
      </v-btn>

      <v-btn
        class="ma-2"
        color="red"
      >
        Decline
        <v-icon
          icon="mdi-cancel"
          end
        ></v-icon>
      </v-btn>

      <v-btn
        class="ma-2"
      >
        <v-icon
          icon="mdi-minus-circle"
          start
        ></v-icon>
        Cancel
      </v-btn>
    </div>

    <div>
      <v-btn
        class="ma-2"
        color="orange-darken-2"
      >
        <v-icon
          icon="mdi-arrow-left"
          start
        ></v-icon>
        Back
      </v-btn>

      <v-btn
        class="ma-2"
        color="purple"
        icon="mdi-wrench"
      ></v-btn>

      <v-btn
        class="ma-2"
        color="indigo"
        icon="mdi-cloud-upload"
      ></v-btn>
    </div>

    <div>
      <v-btn
        class="ma-2"
        color="blue-lighten-2"
        icon="mdi-thumb-up"
        variant="text"
      ></v-btn>

      <v-btn
        class="ma-2"
        color="red-lighten-2"
        icon="mdi-thumb-down"
        variant="text"
      ></v-btn>
    </div>
  </div>
</template>
  