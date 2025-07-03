<template>
    <div class="container">
        <h1>Bedienungsanleitung für den Enigma-Zyklometer</h1>

        <div class="video-container">
            <video controls preload="metadata">
                <source src="/data/zyklometer-video.webm" type="video/webm">
                Dein Browser unterstützt das Video-Tag nicht.
            </video>
        </div>

        <p>Der Zyklometer hilft dir, Muster in der Enigma-Verschlüsselung zu finden, die man "Zyklen" nennt. Das ist nützlich, wenn man versucht, geheime Nachrichten zu knacken.</p>

        <section class="section-left">
            <h2>Teil 1: Charakteristische Zyklen erstellen (Links)</h2>
            <p>Hier legst du fest, welche Enigma-Einstellungen der Zyklometer untersuchen soll.</p>

            <ul>
                <li><strong>Modell:</strong> Hier kannst du die verschiedenen Modelle einstellen.</li>
                <li><strong>Walzenlage:</strong> Wähle aus, in welcher Reihenfolge die drei Walzen (I, II, III, IV, V, VI, VII, VIII) in der Enigma sitzen. Du kannst sie hier frei anordnen.</li>
                <li><strong>Walzenstellung:</strong> Für jede der drei Walzen stellst du einen Startbuchstaben ein (A bis Z). Dies ist der Ausgangspunkt der Walzen.</li>
                <li><strong>Ringstellung:</strong> Für jede der drei Walzen stellst du die Ringstellung ein (A bis Z). Wenn das Kästchen "Aktivieren" angekreuzt ist, wird die Ringstellung berücksichtigt.</li>
                <li><strong>Steckerbrett:</strong> Hier kannst du Buchstabenpaare verbinden (z.B. AB für A mit B). Diese Verbindungen ändern die Verschlüsselung zusätzlich. Du kannst bis zu 10 Paare eingeben.</li>
            </ul>

            <h3>Spruchschlüssel:</h3>
            <ul>
                <li><strong>Zufällig generieren:</strong> Du kannst einen Schieberegler nutzen, um eine Anzahl (z.B. 100) von zufälligen Spruchschlüsseln erstellen zu lassen. Ein Spruchschlüssel ist eine kurze, oft dreibuchstabige Anfangsstellung für die Verschlüsselung einer Nachricht.</li>
                <li><strong>Hinzufügen:</strong> Klicke hier, um die von dir eingestellten Spruchschlüssel oder die zufällig generierten zu deiner Liste hinzuzufügen.</li>
                <li><strong>Löschen:</strong> Löscht die aktuell ausgewählten Spruchschlüssel aus der Liste.</li>
            </ul>
        </section>

        <section class="section-right">
            <h2>Teil 2: Ergebnisse anzeigen und filtern (Rechts)</h2>
            <p>Hier siehst du die Zyklen, die der Zyklometer gefunden hat, und kannst danach suchen.</p>

            <h3>Zyklen mit Verdoppelungen:</h3>
            <p>Zeigt die Zyklen an, die auftreten, wenn ein Buchstabe zweimal hintereinander im Spruchschlüssel vorkommt (z.B. "AA", "BB", "CC"). Jeder "Zyklus" ist hier eine spezielle mathematische Abfolge, die der Enigma-Algorithmus erzeugt. Die Zahlen (z.B. "1 - 4") geben die Länge der Zyklen an.</p>

            <h3>Zyklen ohne Verdoppelungen:</h3>
            <p>Zeigt die Zyklen an, die entstehen, wenn die Buchstaben im Spruchschlüssel nicht doppelt vorkommen.</p>

            <h3>Filtern nach:</h3>
            <p>Du kannst die angezeigten Zyklen weiter eingrenzen:</p>
            <ul>
                <li><strong>Nach Walzenlage filtern:</strong> Wenn du dies ankreuzt, werden nur Zyklen angezeigt, die zu einer bestimmten Walzenlage gehören.</li>
                <li><strong>Nach Walzenstellung filtern:</strong> Wenn du dies ankreuzt, werden nur Zyklen angezeigt, die zu einer bestimmten Walzenstellung gehören.</li>
            </ul>

            <h3>Sortiere nach:</h3>
            <p>Du kannst die Reihenfolge der angezeigten Zyklen ändern:</p>
            <ul>
                <li>Wähle im ersten Feld, wonach sortiert werden soll (z.B. "Walzenlage").</li>
                <li>Wähle im zweiten Feld, ob es "Aufsteigend" (von A nach Z, von klein nach groß) oder "Absteigend" (von Z nach A, von groß nach klein) sortiert werden soll.</li>
            </ul>
        </section>

        <p class="important-note"><strong>Wichtig:</strong> Der Zyklometer ist ein Werkzeug, das Kryptoanalysten (Menschen, die geheime Nachrichten knacken) geholfen hat, Muster in der Enigma zu finden, um die Einstellungen der Maschine zu erraten.</p>
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
    min-width: 350px; /* Mindestbreite, damit es nicht zu schmal wird auf kleinen Bildschirmen */
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