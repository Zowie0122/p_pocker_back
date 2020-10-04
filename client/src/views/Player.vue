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

    <div>
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
    </div>
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
      cardDeck: [],
    };
  },
  created: function() {
    const id = this.sessionID;
    const name = this.playerName;
    let socket;
    socket = io(this.endpoint);
    socket.emit("playerJoin", { id, name }, ({ votesInfo, cardDeck }) => {
      this.votesInfo = votesInfo;
      this.cardDeck = cardDeck;
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
    socket.on("updatedSession", ({ updatedVotesInfo }) => {
      this.votesInfo = updatedVotesInfo;
    });
  },
};
</script>
