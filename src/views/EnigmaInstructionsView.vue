<template>
    <div class="container">
        <h1>Bedienungsanleitung für die Enigma Simulation</h1>

        <div class="video-container">
            <video controls preload="metadata">
                <source src="/data/engima-video.webm" type="video/webm">
                Dein Browser unterstützt das Video-Tag nicht.
            </video>
        </div>

        <section class="section-left">
            <h2>Was muss ich einstellen?</h2>
            <ul>
                <li><strong>Modell:</strong> Hier kannst du auswählen, welches Modell du simulieren möchtest.</li>
                <li><strong>Walzenlage:</strong> Du siehst drei Kästchen mit römischen Zahlen (I, II, III). Wähle aus, in welcher Reihenfolge die Walzen liegen sollen. Das ist wichtig für die Geheimschrift.</li>
                <li><strong>Walzenstellung:</strong> Du siehst wieder drei Kästchen mit Buchstaben (A). Wähle für jedes Kästchen einen Start-Buchstaben aus (A bis Z). Das ist wie ein Startpunkt.</li>
                <li><strong>Ringstellung:</strong> Auch hier siehst du drei Kästchen mit Buchstaben (A). Wähle für jedes Kästchen einen Buchstaben aus (A bis Z). Das ist ein weiterer wichtiger Punkt für die Geheimschrift.</li>
                <li><strong>Steckerbrett:</strong> Hier kannst du Buchstabenpaare verbinden. Zum Beispiel schreibst du "AB" in ein Kästchen. Dann sind A und B miteinander verbunden. Das macht die Geheimschrift noch schwerer zu knacken. Du kannst bis zu 10 Paare machen.</li>
            </ul>
        </section>

        <section class="section-right">
            <h2>Wie schreibe oder lese ich geheime Nachrichten?</h2>
            <ul>
                <li>Schreibe deinen Text in das große Feld unter "Eingabe".</li>
                <li>Klicke auf den grauen Knopf unter den Einstellungen, wo "Bitte Text eingeben" steht.</li>
                <li>Dein geheimer Text erscheint dann im großen Feld unter "Ausgabe".</li>
            </ul>
        </section>

        <p class="important-note"><strong>Ganz wichtig:</strong> Wenn du eine geheime Nachricht verschickst oder liest, müssen alle Einstellungen (Walzenlage, Walzenstellung, Ringstellung und Steckerbrett) genau gleich sein wie bei der Person, die die Nachricht bekommt oder schickt. Sonst klappt es nicht!</p>
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
    gap: 20px; /* Abstand zwischen den Spalten */
}

h1 {
    color: #2c3e50;
    text-align: center;
    width: 100%; /* Nimmt die volle Breite ein */
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
.section-left, .section-right {
    flex: 1; /* Nimmt den verfügbaren Platz gleichmäßig ein */
    min-width: 400px; /* Mindestbreite, damit es nicht zu schmal wird auf kleinen Bildschirmen */
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 5px;
    background-color: #fafafa;
}

.section-left {
    border-left: 5px solid #28a745; /* Grüner Rand für "Links" */
}

.section-right {
    border-left: 5px solid #007bff; /* Blauer Rand für "Rechts" */
}

/* Wichtiger Hinweis */
.important-note {
    background-color: #ffeeba;
    border: 1px solid #ffc107;
    padding: 15px;
    border-radius: 5px;
    margin-top: 20px;
    color: #856404;
    width: 100%; /* Nimmt die volle Breite ein */
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
        flex-direction: column; /* Stapelt die Abschnitte untereinander auf kleinen Bildschirmen */
    }

    .section-left, .section-right {
        min-width: unset; /* Setzt Mindestbreite zurück */
        width: 100%; /* Nimmt volle Breite ein */
    }
}
</style>