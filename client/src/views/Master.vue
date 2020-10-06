<template>
  <div id="container">
    <clock />
    <h2 class="m-3">Session ID : {{ sessionID }}</h2>

    <h5>
      Game controls:
    </h5>

    <b-button
      v-if="okToShowVotes"
      class="m-3"
      variant="primary"
      @click="showVotesHandler"
      >Show Votes</b-button
    >

    <b-button v-if="!okToShowVotes" class="m-3" @click="showVotesHandler"
      >Show Votes</b-button
    >

    <b-button class="m-3" variant="warning" @click="resetVotesHandler"
      >Reset Votes</b-button
    >

    <div>
      <vote-status :session_status="sessionStatus" />
      <player-list :votes_info="votesInfo" />
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import { removeMaster } from "../utils";
import VoteStatus from "../components/VoteStatus.vue";
import PlayerList from "../components/PlayerList.vue";
export default {
  name: "Master",

  components: {
    VoteStatus,
    PlayerList,
  },

  data: function() {
    return {
      sessionID: this.$route.params.id,
      votesInfo: [],
      uid: "",
      sessionStatus: "",
      okToShowVotes: false,
      socket: io("http://localhost:5000"),
    };
  },

  created: function() {
    // to register master as name of 00000, differentiate from players just in case if there are some uses
    this.socket.emit(
      "join",
      { sessionID: this.sessionID, name: "00000" },
      ({ sessionObject, uid }) => {
        this.sessionStatus = sessionObject.status;
        this.uid = uid;
        this.votesInfo = removeMaster(uid, sessionObject.votesInfo);
      }
    );
  },

  methods: {
    showVotesHandler: function() {
      if (this.okToShowVotes) {
        this.socket.emit("showVotes", { sessionID: this.sessionID });
      }
    },
    resetVotesHandler: function() {
      this.socket.emit("resetVotes", { sessionID: this.sessionID });
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

<style scoped>
#container {
  text-align: center;
}
</style>
