<template>
  <div class="home">
    <reader></reader>
  </div>
</template>

<script>
// @ is an alias to /src
import Reader from '@/components/reader'

export default {
  name: 'home',
  components: {
    Reader
  }
}
</script>
