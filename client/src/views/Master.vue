<template>
  <div>
    <h1>Master Page</h1>
    <p>Session ID : {{ sessionID }}</p>
    <clock />
    <div>
      <div>Game controls</div>
      <div>
        <button @click="showVotesHandler">Show Votes</button>
      </div>

      <div>
        <button @click="resetVotesHandler">Reset Votes</button>
      </div>
    </div>

    <div>
      Now voting

      <ul>
        <li v-for="(status, name, index) in votesInfo" :key="index">
          {{ name }}................{{ status }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: "Master",

  data: function() {
    return {
      endpoint: "http://localhost:5000",
      sessionID: this.$route.params.id,
      votesInfo: {},
      sessionStatus: "",
      okToShowVotes: false
    };
  },

  // created: function() {
  //   const id = this.sessionID;
  //   const name = "master";
  //   let socket;
  //   socket = io(this.endpoint);
  //   socket.emit("join", { id, name }, ({ sessionStatus }) => {
  //     this.sessionStatus = sessionStatus;
  //   });
  // },
  methods: {
    showVotesHandler: function() {
      let socket;
      socket = io(this.endpoint);
      const id = this.sessionID;

      socket.emit("showVotes", { id }, () => {
        console.log(`session ${id} server handled the showVotes`);
      });
    },
    resetVotesHandler: function() {
      let socket;
      socket = io(this.endpoint);
      const id = this.sessionID;
      socket.emit("resetVotes", { id }, () => {
        console.log(`session ${id} server handled the resetVotes`);
      });
    }
  },

  mounted() {
    let socket;
    socket = io(this.endpoint);
    socket.on(
      "updatedSession",
      ({ updatedVotesInfo, sessionStatus, okToShowVotes }) => {
        this.votesInfo = updatedVotesInfo;
        this.sessionStatus = sessionStatus;
        this.okToShowVotes = okToShowVotes;
      }
    );
  }
};
</script>
