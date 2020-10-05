<template>
  <div>
    <h1>Player Page</h1>
    <p>Session ID : {{ sessionID }}</p>
    <clock />

    <div>
      Now voting
      <ul>
        <li v-for="(status, name, index) in votesInfo" :key="index">
          {{ name }}................[{{ status }}]
        </li>
      </ul>
    </div>

    <template v-if="sessionStatus === 'Vote in progress'">
      Your Vote:
      <ul>
        <li
          v-for="(card, index) in cardDeck"
          :key="index"
          @click="voteHandler(card, index)"
        >
          [ {{ card }} ]
        </li>
      </ul>
    </template>
    <template v-else>
      (i) Please wait for the Master to start another vote
    </template>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: "Player",

  data: function() {
    return {
      endpoint: "http://localhost:5000",
      sessionID: this.$route.params.id,
      playerName: this.$route.params.name,
      votesInfo: {},
      cardDeck: ["no vote"],
      sessionStatus: "",
    };
  },
  created: function() {
    const id = this.sessionID;
    const name = this.playerName;
    let socket;
    socket = io(this.endpoint);
    socket.emit("playerJoin", { id, name }, ({ cardDeck, sessionStatus }) => {
      // this.votesInfo = votesInfo;
      this.cardDeck = [...this.cardDeck, ...cardDeck];
      this.sessionStatus = sessionStatus;
    });
  },
  methods: {
    voteHandler: function(card) {
      let socket;
      socket = io(this.endpoint);
      const id = this.sessionID;
      const name = this.playerName;
      socket.emit("vote", { id, name, card });
    },
  },
  mounted() {
    let socket;
    socket = io(this.endpoint);
    socket.on("updatedSession", ({ updatedVotesInfo, sessionStatus }) => {
      this.votesInfo = updatedVotesInfo;
      this.sessionStatus = sessionStatus;
      console.log(this.sessionStatus);
    });
  },
};
</script>
