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
            <h2>Was kann eingestellt werden?</h2>
            <ul>
                <li><strong>Modell:</strong> Bestimmt das zu simulierende Enigma-Modell. Die Modellwahl beeinflusst die
                    verfügbaren Walzen, Reflektoren sowie das Verhalten des Steckbretts und damit die resultierende
                    Verschlüsselungslogik. Bei dem Modell M4 wird die Umkehrwalze durch eine dünne Umkehrwalze, und eine
                    vierte, dünne Walze, welche keine Ringstellung besitzt, ersetzt.</li>
                <li><strong>Walzenlage:</strong> Legt die Reihenfolge der drei Walzen im Walzensatz fest. Die Position
                    jeder Walze beeinflusst maßgeblich die interne Verdrahtung und damit das Verschlüsselungsergebnis.
                </li>
                <li><strong>Umkehrwalze:</strong> Links neben den drei Walzenfeldern befindet sich die Auswahl der
                    Umkehrwalze (UKW). Welche Reflektoren verfügbar sind, hängt vom gewählten Enigma-Modell ab. Der
                    Reflektor bestimmt maßgeblich die Rückführung des Signals und beeinflusst so das
                    Verschlüsselungsergebnis.</li>
                <li><strong>Walzenstellung:</strong> Drei Eingabefelder erlauben die Festlegung der Startposition jeder
                    Walze (Buchstabe A–Z). Diese Startbuchstaben entsprechen der initial sichtbaren Walzenposition bei
                    Inbetriebnahme. Die eingeblendeten Sterne markieren die Stellung der Einkerbung ("Notch") der
                    jeweiligen Walze bei neutraler Ringstellung – entscheidend für den Walzenfortschalt beim
                    Verschlüsseln.</li>
                <li><strong>Ringstellung:</strong> Drei Felder ermöglichen die Einstellung der Ringstellung (A–Z) für
                    jede Walze. Diese legt fest, wie die interne Verdrahtung relativ zur äußeren Beschriftung verschoben
                    ist. Solange keine Einkerbung (Notch) erreicht wird, bleibt die Verschlüsselung bei gemeinsamer
                    Drehung von Walzenstellung und Ringstellung identisch.</li>
                <li><strong>Steckerbrett:</strong> Hier können bis zu zehn Buchstabenpaare (z.B. „AB“) eingegeben
                    werden, die den Steckbrett-Einstellungen der Enigma entsprechen. Jedes Paar vertauscht die beiden
                    Buchstaben vor und nach der Walzenlogik und erhöht so die kryptographische Komplexität der Maschine.
                </li>
            </ul>
        </section>

        <section class="section-right">
            <h2>Wie erfolgt die Verschlüsselung und Entschlüsselung geheimer Nachrichten?</h2>
            <ul>
                <li>Text in das Eingabefeld unter „Eingabe“ eingeben.</li>
                <li>Klicke auf den grauen Knopf unter den Einstellungen mit der Beschriftung „Text rechts eingeben“ oder
                    warte kurz, der Text wird automatisch verschlüsselt.</li>
                <li>Die Walzenstellung wird für den Anfangspunkt der Nachricht gesetzt, danach läuft diese intern für
                    jeden Buchstaben weiter.</li>
                <li>Der verschlüsselte Text wird im großen Feld unter „Ausgabe“ angezeigt.</li>
            </ul>

            <h2>Interessant:</h2>
            <ul>
                <li>Der verschlüsselte Text kann erneut als Eingabe verwendet werden, wodurch die ursprüngliche
                    Klartextnachricht als Ausgabe zurückgegeben wird. Dies ist möglich, weil die Enigma-Verschlüsselung
                    involutorisch ist.</li>
                <li>Die Enigma M4 ist in bestimmten Einstellungen abwärtskompatibel zur M3:
                    Dafür muss die M4 die dünne UKW b zusammen mit der Walze Beta in neutraler Stellung (A) verwenden um
                    mit der M3 mit UKW B kompatibel zu sein.
                    Analog dazu ist UKW C mit dünner UKW c zusammen mit Gamma-Walze kompatibel.</li>
            </ul>
        </section>

        <p class="important-note"><strong>Wichtig:</strong> Für eine erfolgreiche Ver- oder Entschlüsselung müssen
            Walzenlage, Walzenstellung, Ringstellung und Steckerbrett auf beiden Seiten exakt übereinstimmen.
            Abweichungen führen zu falscher Ausgabe.</p>
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

p {
    text-align: left;
}

li {
    text-align: left;
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