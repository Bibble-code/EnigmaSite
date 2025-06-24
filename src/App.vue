<template>
  <nav>
    <router-link to="/">Enigma</router-link> |
    <router-link to="/cyclometer">Zyklometer</router-link>  |
    <router-link to="/manual">Bedienungsanleitung</router-link>


  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  font-size: 2rem;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
