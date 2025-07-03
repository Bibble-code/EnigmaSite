<template>
    <div class="container">
        <h1>Projekt im Rahmen einer Bachelorarbeit</h1>
        <p>
            Diese Webseite wurde im Zuge meiner Bachelorarbeit an der
            <strong>Hochschule Ravensburg-Weingarten</strong> entwickelt.<br />
            Der Quellcode zur Umsetzung dieser Thesis sowie die Thesis selbst sind auf GitHub verfügbar:<br />
            <a href="https://github.com/Bibble-code/Enigma-Zyklometer-Notes" target="_blank" rel="noopener noreferrer">
                https://github.com/Bibble-code/Enigma-Zyklometer-Notes
            </a><br />
            Entwickelt von Tobias Steidle.
        </p>
    </div>
</template>

<script setup>
</script>

<style scoped>
/* Grundlegende Stile */
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 20px;
    background-color: #f4f4f4;
    color: #333;
}

.container {
    max-width: 900px;
    margin: auto;
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    /* Abstand zwischen den Spalten */
}

h1 {
    color: #2c3e50;
    text-align: center;
    width: 100%;
    /* Nimmt die volle Breite ein */
    margin-bottom: 20px;
}

h2 {
    color: #34495e;
    border-bottom: 2px solid #ddd;
    padding-bottom: 5px;
    margin-top: 25px;
}

h3 {
    color: #555;
    margin-top: 20px;
}

ul {
    list-style-type: disc;
    margin-left: 20px;
    padding: 0;
}

li {
    margin-bottom: 8px;
}

strong {
    color: #000;
}

/* Layout für die beiden Hauptteile */
.section-left,
.section-right {
    flex: 1;
    /* Nimmt den verfügbaren Platz gleichmäßig ein */
    min-width: 400px;
    /* Mindestbreite, damit es nicht zu schmal wird auf kleinen Bildschirmen */
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 5px;
    background-color: #fafafa;
}

.section-left {
    border-left: 5px solid #28a745;
    /* Grüner Rand für "Links" */
}

.section-right {
    border-left: 5px solid #007bff;
    /* Blauer Rand für "Rechts" */
}

/* Wichtiger Hinweis */
.important-note {
    background-color: #ffeeba;
    border: 1px solid #ffc107;
    padding: 15px;
    border-radius: 5px;
    margin-top: 20px;
    color: #856404;
    width: 100%;
    /* Nimmt die volle Breite ein */
    text-align: center;
}

.video-container {
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
}

.video-container video {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        flex-direction: column;
        /* Stapelt die Abschnitte untereinander auf kleinen Bildschirmen */
    }

    .section-left,
    .section-right {
        min-width: unset;
        /* Setzt Mindestbreite zurück */
        width: 100%;
        /* Nimmt volle Breite ein */
    }
}
</style>