<template>
  <div id="container">
    <clock />
    <h2 class="m-3">Session ID : {{ sessionID }}</h2>

    <div class="m-3">
      <vote-status :session_status="sessionStatus" />
      <player-list :votes_info="votesInfo" />
    </div>

    <template v-if="sessionStatus === 'Vote in progress'" class="m-3">
      Your Vote:
      <div class="m-3">
        <b-button
          variant="dark"
          class="m-1"
          size="lg"
          v-for="(card, index) in cards"
          :key="index"
          @click="voteHandler(index)"
        >
          [ {{ card }} ]
        </b-button>
      </div>
    </template>

    <template v-else>
      <h6>
        (i) Please wait for the Master to start another vote
      </h6>
    </template>
  </div>
</template>

<script>
import io from "socket.io-client";
import { getCurrentPlayerToTop } from "../utils";
import VoteStatus from "../components/VoteStatus.vue";
import PlayerList from "../components/PlayerList.vue";
import { isValidID, isValidName } from "../utils";

export default {
  name: "Player",

  components: {
    VoteStatus,
    PlayerList,
  },

  data: function() {
    return {
      sessionID: this.$route.params.id,
      playerName: this.$route.params.name,
      uid: "",
      sessionStatus: "",
      votesInfo: [],
      cardDeck: [],
      vote: "no vote",
      isMasterLeft: false,
      socket: io("http://localhost:5000"),
    };
  },

  created: function() {
    // if a user jump in by url , check if it is valid
    if (
      !isValidID(this.sessionID) ||
      this.playerName.trim() === "" ||
      !isValidName(this.playerName)
    ) {
      this.$router.push("/");
    } else {
      this.socket.emit(
        "join",
        { sessionID: this.sessionID, name: this.playerName },
        ({ sessionObject, cardDeck, uid }) => {
          console.log("###", sessionObject);
          // if the session id is not existed, send user back to home page
          if (!sessionObject) {
            this.$router.push("/welcome");
          } else {
            this.sessionStatus = sessionObject.status;
            this.cardDeck = ["no vote", ...cardDeck];
            this.uid = uid;
            this.votesInfo = getCurrentPlayerToTop(
              uid,
              sessionObject.votesInfo
            );
          }
        }
      );
    }
  },

  mounted() {
    this.socket.on("updatedSession", ({ sessionObject, isMaster }) => {
      if (isMaster !== undefined && isMaster) {
        this.isMasterLeft = true;
        alert("Master Left");
      }
      this.votesInfo = getCurrentPlayerToTop(this.uid, sessionObject.votesInfo);
      this.sessionStatus = sessionObject.status;
      if (this.sessionStatus === "Vote complete") {
        this.vote = "no vote";
      }
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
      this.socket.emit("vote", {
        sessionID: this.sessionID,
        uid: this.uid,
        card: this.vote,
      });
    },
  },
};
</script>

<style scoped>
#container {
  text-align: center;
}
</style>
