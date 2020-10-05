<template>
  <div>
    <h1>Welcome to the Planning Poker!</h1>
    <div>
      <h2>Start a new Planning poker session</h2>
      <p>you will be the Game Master</p>
      <div>
        <button @click="newSessionHandler">start</button>
      </div>
      <p v-if="sessionIDError.error">{{ sessionIDError.message }}</p>
    </div>

    <div>----------------------- OR -----------------------</div>

    <div>
      <h2>Join an existing Session</h2>
      <p>you'll need a Session ID provided to you by the Game Master</p>
      <p>Session ID</p>

      <input v-model="sessionID" />
      <p v-if="sessionIDError.error">{{ sessionIDError.message }}</p>
      <p>Your nickname</p>

      <input v-model="nickname" />
      <p v-if="nicknameError.error">{{ nicknameError.message }}</p>
      <div>
        <button @click="joinSessionHandler">join</button>
      </div>
    </div>
  </div>
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
