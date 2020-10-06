<template>
  <div class="m-3">
    <h5 v-if="session_status === 'Vote in progress'">
      Now voting
    </h5>
    <h5 v-if="session_status === 'Vote complete'">
      Vote complete
    </h5>
  </div>
</template>

<script>
export default {
  name: "VoteStatus",
  props: {
    session_status: String,
  },
};
</script>
