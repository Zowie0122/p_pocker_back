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

      <p>Your nickname</p>

      <input v-model="nickname" />
      <div>
        <button @click="joinSessionHandler">join</button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "WelcomeScreen",
  data: function() {
    return {
      sessionID: "",
      nickname: "",
      sessionIDValidation: {
        error: false,
        message: ""
      },
      nicknameValidation: {
        error: false,
        message: ""
      }
    };
  },
  methods: {
    newSessionHandler: function() {
      // generate a sessionID from backend and direct to new page '/sessionid=***-****-***/name=master'
      const sessionID = "abc-efgh-ijk";
      this.$router.push(`/master/session/${sessionID}`);
    },

    joinSessionHandler: function() {
      if (!this.sessionIDValidator.error && !this.nicknameValidator.error) {
        this.$router.push(`/player/${this.nickname}/session/${this.sessionID}`);
      }
    }
  },

  computed: {
    sessionIDValidator: function() {
      // validate sessionID from backend if it is duplicated from any other ongoing session
      return true;
    },
    nicknameValidator: function() {
      // validate if the nickname is actual empty
      return true;
    }
  }
};
</script>