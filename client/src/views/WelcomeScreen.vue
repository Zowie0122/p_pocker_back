<template>
  <b-jumbotron class="app">
    <h1>Welcome to the Planning Poker!</h1>
    <div>
      <h2>Start a new Planning poker session</h2>
      <p>you will be the Game Master</p>
      <div>
        <b-button
          variant="info"
          class="m-3"
          size="lg"
          @click="newSessionHandler"
          >start</b-button
        >
      </div>
      <b-alert
        class="m-2 w-25 mx-auto"
        show
        variant="danger"
        v-if="startSessionError.error"
        >{{ startSessionError.message }}</b-alert
      >
    </div>
    <hr />
    <p class="m-5">OR</p>
    <hr />
    <div>
      <h2>Join an existing Session</h2>
      <p>you'll need a Session ID provided to you by the Game Master</p>

      <div class="m-3">
        <p>Session ID</p>
        <b-input-group class="w-50 mb-1 mx-auto">
          <b-form-input v-model="sessionID"></b-form-input>
        </b-input-group>
        <b-alert
          class="w-50 mb-1 mx-auto"
          show
          variant="danger"
          v-if="sessionIDError.error"
          >{{ sessionIDError.message }}</b-alert
        >
      </div>

      <div class="m-3">
        <p>Your nickname</p>
        <b-input-group class="w-50 mb-1 mx-auto">
          <b-form-input v-model="nickname"></b-form-input>
        </b-input-group>
        <b-alert
          class="w-50 mb-1 mx-auto"
          show
          variant="danger"
          v-if="nicknameError.error"
          >{{ nicknameError.message }}</b-alert
        >
        <div>
          <b-button
            variant="primary"
            class="m-3"
            size="lg"
            @click="joinSessionHandler"
            >join</b-button
          >
        </div>
      </div>
    </div>
  </b-jumbotron>
</template>

<script>
import axios from "axios";
import { isValidID, isValidName } from "../utils";
export default {
  name: "WelcomeScreen",
  data: function() {
    return {
      endpoint: "http://localhost:5000",
      sessionID: "",
      nickname: "",
      startSessionError: {
        error: false,
        message: "",
      },
      sessionIDError: {
        error: false,
        message: "",
      },
      nicknameError: {
        error: false,
        message: "",
      },
    };
  },
  methods: {
    newSessionHandler: async function() {
      // clear the previous error record if there was
      this.startSessionError.error = false;

      // generate a sessionID from backend and direct to new page /master/session/:id
      const res = await axios.get(this.endpoint);
      if (res.data.sessionID) {
        this.$router.push(`/master/session/${res.data.sessionID}`);
      } else {
        this.startSessionError = {
          error: true,
          message: "Oops,there might be an error,please try again",
        };
      }
    },

    joinSessionHandler: async function() {
      // clear the previous error record if there was
      this.sessionIDError.error = false;
      this.nicknameError.error = false;

      // check if session id if valid in terms of formatting
      if (!isValidID(this.sessionID)) {
        this.sessionIDError = {
          error: true,
          message: "The session id is not valid",
        };
      }
      // check if nickname is actually empty
      if (this.nickname.trim() === "") {
        this.nicknameError = {
          error: true,
          message: "Nickname could not be null",
        };
      }

      // check if username contains invalid characters
      if (!isValidName(this.nickname)) {
        this.nicknameError = {
          error: true,
          message:
            "Nickname should only contain latin letters (lower or uppercase)",
        };
      }

      // check if the session id is still exsiting
      if (!this.sessionIDError.error && !this.nicknameError.error) {
        const res = await axios.post(this.endpoint, {
          sessionID: this.sessionID,
        });

        if (res.status === 200 && res.data.isExisting) {
          this.$router.push(
            `/player/${this.nickname}/session/${this.sessionID}`
          );
        }
        if (res.status === 200 && !res.data.isExisting) {
          this.sessionIDError = {
            error: true,
            message: "The session is not existed!",
          };
        }
        if (res.status === 400) {
          this.sessionIDError = {
            error: true,
            message: "Ohh,There might be a server error",
          };
        }
      }
    },
  },
};
</script>

<style scoped>
.app {
  text-align: center;
}
</style>
