<template>
  <div>
    <p v-if="session_Status === 'Vote in progress'">
      Now voting
    </p>
    <p v-if="session_Status === 'Vote complete'">
      Vote complete
    </p>
  </div>
</template>

<script>
export default {
  name: "VoteStatus",
  props: {
    session_Status: String,
  },
};
</script>
