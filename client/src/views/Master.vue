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
        <li
          v-for="(info, index) in votesInfo"
          :key="index"
          v-bind:style="{ color: info.colorCode }"
        >
          {{ info.name }}................[{{ info.status }}]
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import { removeMaster } from "../utils";
export default {
  name: "Master",

  data: function() {
    return {
      sessionID: this.$route.params.id,
      votesInfo: [],
      sessionStatus: "",
      uid: "",
      okToShowVotes: false,
      socket: io("http://localhost:5000"),
    };
  },

  created: function() {
    const sessionID = this.sessionID;
    const name = "00000";
    this.socket.emit("join", { sessionID, name }, ({ sessionObject, uid }) => {
      this.sessionStatus = sessionObject.status;
      this.uid = uid;
      this.votesInfo = removeMaster(uid, sessionObject.votesInfo);
    });
  },

  methods: {
    showVotesHandler: function() {
      const sessionID = this.sessionID;
      this.socket.emit("showVotes", { sessionID });
    },
    resetVotesHandler: function() {
      const sessionID = this.sessionID;
      this.socket.emit("resetVotes", { sessionID });
    },
  },

  mounted() {
    this.socket.on("updatedSession", ({ sessionObject }) => {
      this.sessionStatus = sessionObject.status;
      this.okToShowVotes = sessionObject.okToShowVotes;
      this.votesInfo = removeMaster(this.uid, sessionObject.votesInfo);
    });
  },
};
</script>
