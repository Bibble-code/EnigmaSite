<template>
  <nav>
    <router-link to="/">Enigma</router-link> |
    <router-link to="/cyclometer">Zyklometer</router-link>  |
    <router-link to="/enigma-instructions">Anleitung Enigma</router-link>  |
    <router-link to="/cyclometer-instructions">Anleitung Zyklometer</router-link>  |
    <router-link to="/about">About</router-link>
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

html {
  overflow-y: scroll;
}

body {
    background-color: #eaeaea;
    /* einfache Hintergrundfarbe */
    /* oder mit Bild */
    /* background-image: url('dein-bild.jpg'); */
    /* background-size: cover; */
    /* background-repeat: no-repeat; */
    /* background-position: center center; */
    margin: 0;
    /* Optional, um Standardabstände zu entfernen */
    min-height: 100vh;
    /* Damit der Hintergrund immer die ganze Höhe hat */
    scrollbar-gutter: stable;
}
</style>
