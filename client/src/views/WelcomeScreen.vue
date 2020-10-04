<template>
  <div>
    <h1>Welcome to the Planning Poker!</h1>
    <div>
      <h2>Start a new Planning poker session</h2>
      <p>you will be the Game Master</p>
      <div>
        <button @click="newSessionHandler">start</button>
      </div>
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
import io from "socket.io-client";
export default {
  name: "WelcomeScreen",
  data: function() {
    return {
      endpoint: "http://localhost:5000",
      sessionID: "",
      nickname: "",
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
    newSessionHandler: function() {
      // generate a sessionID from backend and direct to new page /master/session/:id
      let socket;
      socket = io(this.endpoint);
      socket.emit("getNewSessionId", {}, ({ id }) => {
        this.$router.push(`/master/session/${id}`);
      });
    },

    joinSessionHandler: function() {
      if (this.nickname.trim() === "") {
        this.nicknameError.error = true;
        this.nicknameError.message = "Nickname could not be null";
      }
      const id = this.sessionID;
      let socket;
      socket = io(this.endpoint);
      socket.emit("checkSessionID", { id }, ({ existed }) => {
        if (existed) {
          this.$router.push(
            `/player/${this.nickname}/session/${this.sessionID}`
          );
        }
        this.sessionIDError.error = true;
        this.sessionIDError.message = "The session is not existed!";
      });
    },
  },
};
</script>
