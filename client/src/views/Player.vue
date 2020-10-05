<template>
  <div>
    <h1>Player Page</h1>
    <p>Session ID : {{ sessionID }}</p>
    <clock />

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

    <template v-if="sessionStatus === 'Vote in progress'">
      Your Vote:
      <div>
        <div
          v-for="(card, index) in cards"
          :key="index"
          @click="voteHandler(index)"
        >
          [ {{ card }} ]
        </div>
      </div>
    </template>
    <template v-else>
      (i) Please wait for the Master to start another vote
    </template>
  </div>
</template>

<script>
import io from "socket.io-client";
import { getCurrentPlayerToTop } from "../utils";

export default {
  name: "Player",

  data: function() {
    return {
      sessionID: this.$route.params.id,
      playerName: this.$route.params.name,
      votesInfo: [],
      cardDeck: [],
      uid: "",
      colorCode: "",
      sessionStatus: "",
      vote: "no vote",
      socket: io("http://localhost:5000"),
    };
  },
  created: function() {
    const sessionID = this.sessionID;
    const name = this.playerName;
    this.socket.emit(
      "join",
      { sessionID, name },
      ({ sessionObject, cardDeck, uid }) => {
        console.log(sessionObject);
        this.sessionStatus = sessionObject.status;
        this.cardDeck = ["no vote", ...cardDeck];
        this.uid = uid;
        this.votesInfo = getCurrentPlayerToTop(uid, sessionObject.votesInfo);
      }
    );
  },
  mounted() {
    this.socket.on("updatedSession", ({ sessionObject }) => {
      console.log("sessionObject Updated", sessionObject);
      this.votesInfo = getCurrentPlayerToTop(this.uid, sessionObject.votesInfo);
      this.sessionStatus = sessionObject.status;
    });
  },

  computed: {
    cards: function() {
      const result = [];
      for (const card of this.cardDeck) {
        if (card === this.vote) {
          result.push(`>${card}<`);
        } else {
          result.push(card);
        }
      }
      return result;
    },
  },

  methods: {
    voteHandler: function(index) {
      this.vote = this.cardDeck[index];
      const sessionID = this.sessionID;
      const uid = this.uid;
      const card = this.vote;
      this.socket.emit("vote", { sessionID, uid, card });
    },
  },
};
</script>
