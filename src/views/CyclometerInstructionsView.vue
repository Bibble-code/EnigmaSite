<template>
    <div class="container">
        <h1>Bedienungsanleitung für den Enigma-Zyklometer</h1>

        <div class="video-container">
            <video controls preload="metadata">
                <source src="/data/zyklometer-video.webm" type="video/webm">
                Dein Browser unterstützt das Video-Tag nicht.
            </video>
        </div>

        <p>Das Zyklometer wurde in den 1930er Jahren von den polnischen Kryptoanalysten rund um Rejewski entwickelt um
            die deutsche Enigma-Maschine zu Entschlüsseln. Dabei wurde ein Verfahrenstechnischer Fehler der
            Spruchschlüsselübermittelung ausgenutz, da diese doppelt übertragen wurden (z.B. ASDASD).

            Auf dieser Seite wird das Verfahren rund um das Zylometer simuliert.

            Derzeit wird das Verfahren in zwei Abschnitte eingeteilt:
        </p>
        <ul>
            <li><strong>Zyklen erstellen:</strong> Hier wird aus einer Einstellungen der Enigma und Spruchschlüsseln
                Zyklen mit dem Zyklometer erstellt. Dabei werden die Spruchschlüssel intern erst mit der Einstellung
                verschlüsselt. Anschließend werden diese verschlüsselten Spruchschlüssel an das Zyklometer übergeben,
                welches daraus Zyklen bildet.</li>
            <li><strong>Katalog abfragen:</strong> Hier kann der Katalog der Charakteristiken nach den Zyklen abgefragt
                werden. In der Antwortliste wird die vorher eingestellte Einstellungen der Enigma auftauchen.</li>
        </ul>


        <section class="section-left">
            <h2>Teil 1: Charakteristische Zyklen erstellen (Links)</h2>
            <p>Hier wird festgelegt, mit welcher Enigma-Einstellungen der Zyklometer die Zyklen erstellen soll.</p>

            <ul>
                <li><strong>Modell:</strong> Der Katalog der Charakteristiken wurde nur für UKW B erstellt.</li>
                <li><strong>Walzenlage:</strong>Bestimmung der Reihenfolge der drei Walzen (I–V) im Walzensatz der
                    Enigma. Position jeder Walze kann beliebig definiert werden.</li>
                <li><strong>Walzenstellung:</strong> Für jede der drei Walzen wird eine Anfangsstellung (A–Z) definiert.
                    Sie bestimmt die Ausgangsposition des Walzenkerns relativ zur Eintrittsscheibe beim Start der
                    Verschlüsselung.</li>
                <li><strong>Ringstellung:</strong> Die Ringstellung jeder der drei Walzen wird mit (A bis Z)
                    eingestellt.
                    Nur bei aktivierter Option wird die Ringstellung in der Verschlüsselung berücksichtigt. Der
                    Katalog ist mit neutraler Ringstellung erstellt worden. Bei veränderter Ringstellung muss diese auf
                    die Walzenstellung angerechnet werden.
                    (beide voneinander abziehen und modulo 26 rechnen)</li>
                <li><strong>Steckerbrett:</strong> Buchstabenpaare zur zusätzlichen Verschlüsselungsänderung verbinden
                    (z. B. AB für A mit B). Maximal 10 Paare möglich. Diese Einstellung hat für die erstellten
                    Zyklenlängen keinen Einfluss.</li>
            </ul>

            <h3>Spruchschlüssel:</h3>
            <ul>
                <li><strong>Zufällig generieren:</strong> Über den Schieberegler wird festgelegt, wie viele zufällige
                    Spruchschlüssel generiert werden. Ein Spruchschlüssel besteht aus drei sich wiederholenden
                    Buchstaben, z. B. ABCABC.</li>
                <li><strong>Hinzufügen:</strong> Hiermit werden die eingestellten oder zufällig generierten
                    Spruchschlüssel zur Liste hinzugefügt.</li>
                <li><strong>Löschen:</strong> Löscht die aktuell ausgewählten Spruchschlüssel aus der Liste.</li>
            </ul>
        </section>

        <section class="section-right">
            <h2>Teil 2: Ergebnisse anzeigen und filtern (Rechts)</h2>
            <p>An dieser Stelle werden die vom Zyklometer gefundenen Zyklen angezeigt und können durchsucht werden.

                Die maximale Summe beträgt 26; Zykluslängen treten stets paarweise auf.</p>

            <h3>Zyklen mit Verdoppelungen:</h3>
            <p>Zeigt die Zyklen an, die vom Zyklometer gefunden wurden. Ein Zyklus beschreibt eine Abfolge von
                Positionen im verschlüsselten Spruchschlüssel, die miteinander verknüpft sind. Zum Beispiel bedeutet „1
                – 4“, dass der
                Zyklus die Buchstaben an der ersten und vierten Position im Schlüssel umfasst. Die maximale Summe der
                Zykluslängen beträgt 26; Zykluslängen treten immer paarweise auf.</p>

            <h3>Zyklen ohne Verdoppelungen:</h3>
            <p>Die Verdoppelung der Zyklen wird bei der Datenbankabfrage entfernt, da sie keine zusätzlichen
                Informationen liefert.</p>

            <h3>Filtern nach:</h3>
            <p>Zyklen können hier weiter gefiltert werden:</p>
            <ul>
                <li><strong>Nach Walzenlage filtern:</strong> Bei Aktivierung dieser Option werden nur Zyklen angezeigt,
                    die einer bestimmten Walzenlage zugeordnet sind.</li>
                <li><strong>Nach Walzenstellung filtern:</strong> Bei Aktivierung dieser Option werden nur Zyklen
                    angezeigt, die zu einer bestimmten Walzenstellung gehören.</li>
            </ul>

            <h3>Sortiere nach:</h3>
            <p>Die Reihenfolge der angezeigten Zyklen kann hier geändert werden:</p>
            <ul>
                <li>Im ersten Feld wird das Sortierkriterium definiert.</li>
                <li>Im zweiten Feld wird die Sortierreihenfolge festgelegt: „Aufsteigend“ (A–Z, klein–groß) oder
                    „Absteigend“ (Z–A, groß–klein).</li>
            </ul>
        </section>


        <ul>
            <li>Wenn keine Spruchschlüssel verwendet werden, so werden auch keine Zyklen gefunden.</li>
            <li>Wenn leere Zyklen im Katalog abgefragt werden, so wird der komplette Katalog zurückgegeben (1.054.560).
            </li>
            <li>Wenn der komplette Katalog nach einer bestimmten Walzenlage gefiltert wird, so werden alle möglichen
                Walzenstellungen zurückgegeben (17.576) . </li>
            <li>Wenn der komplette Katalog nach einer bestimmten Walzenstellung gefiltert, so werden alle möglichen
                Walzenlagen zurückgegeben (60). </li>
            <li>Wird sowohl nach Walzenlage und Walzenstellung gefiltert, so kann maximal ein Wert zurückgegeben werden.
            </li>
            <li>Der Informationsgehalt der Zyklen hängt lediglich von den Zyklen ohne Verdoppelung ab, weitere Zyklen
                enthalten keine weitere Information.</li>
        </ul>
        <p class="important-note"><strong>Wichtig:</strong> Der Zyklometer ist ein Werkzeug, mit dem Kryptoanalysten
            Muster in der Enigma erkannt haben, um die Maschineneinstellungen zu bestimmen.

            Auf dieser Seite können entschlüsselte Nachrichten nicht direkt mit dem Zyklometer entschlüsselt werden; es
            ist lediglich möglich, den Zyklometer-Prozess nachzuvollziehen.</p>
    </div>
</template>

<script setup>
</script>

<style scoped>
/* Grundlegende Stile */
/* body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 20px;
    background-color: #f4f4f4;
    color: #333;
} */

p {
    text-align: left;
}

li {
    text-align: left;
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
    min-width: 350px;
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
    text-align: left;
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