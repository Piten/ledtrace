# Complicated Time Peace – Mobile v0.3

En frittstående webapp for å lage lysspor med mobilens bakovervendte kamera. Appen er laget for Safari på iPhone og Chrome på Android. Den har ingen byggetrinn, avhengigheter, serverkode eller kobling til Raspberry Pi og Processing. Kameraet brukes uten mikrofon. Bildebehandling og PNG-eksport skjer i nettleseren. Kamerabilder lastes ikke opp.

## Publiser gratis med GitHub Pages

1. Pakk ut ZIP-filen. Opprett et nytt, separat **offentlig** GitHub-repositorium, for eksempel `complicated-time-peace-mobile`. Velg **Add a README file** ved opprettelse for å få en `main`-gren. Et offentlig repositorium kan bruke GitHub Pages med GitHub Free.
2. Velg **Add file → Upload files**. Last opp `index.html`, `style.css`, `app.js`, `image.js` og eventuelt denne README-filen i roten. Bruk innholdet i mappen, slik at `index.html` ligger på øverste nivå. Arkivet inkluderer også den skjulte filen `.nojekyll`. Du kan ta den med for å hoppe over Jekyll, men appen fungerer også uten den. Velg **Commit changes**.
3. Åpne **Settings → Pages**. Under **Build and deployment**, velg **Deploy from a branch**, deretter `main` og `/(root)`. Klikk **Save**.
4. Vent til **Settings → Pages** viser adressen. Åpne `https://BRUKERNAVN.github.io/complicated-time-peace-mobile/` direkte i Safari på iPhone eller Chrome på Android. Bruk adressen GitHub viser hvis den avviker. Slå på **Enforce HTTPS** hvis valget er tilgjengelig og ikke allerede aktivert.

[GitHubs veiledning for publisering fra en gren](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [HTTPS for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

## Test på begge telefonene

1. Trykk **Åpne kamera** og tillat tilgang. Kontroller at forhåndsvisningen kommer fra bakkameraet. Hold telefonen stødig og sikt inn motivet i kvadratet.
2. Trykk **Start sporing**. Beveg en liten lyskilde mot en mørk bakgrunn. Sporet skal bli liggende. Trykk **Kamera** for å sjekke utsnittet mens sporingen pågår, og **Lysspor** for å se resultatet.
3. Juster **Terskel**. En høyere verdi slipper inn færre og lysere piksler fra kommende kamerabilder. Nullstill mellom forsøk hvis du vil sammenligne terskelverdier fra samme utgangspunkt. Juster **Glød** og se effekten på det eksisterende sporet med en gang.
4. Trykk **Stopp sporing**. Beveg lyset og sjekk at sporet står stille. **Start sporing** fortsetter på samme spor. **Lukk kamera** frigir kameraet og beholder sporet.
5. Trykk **Lagre PNG**. Åpne den lagrede filen og kontroller at den er kvadratisk, 640 × 640 piksler, og at den inneholder lyssporet med valgt glød. Se i nettleserens nedlastinger. Hvis nettleseren åpner bildet, bruk nettleserens lagrings- eller delingsvalg.
6. Trykk **Nullstill** og kontroller at det gamle sporet forsvinner. Prøv også å avvise kameratilgang og gi tilgang på nytt via nettstedsinnstillingene. Bytt til en annen app og tilbake. Åpne kameraet igjen for å fortsette på samme spor hvis siden fortsatt er lastet.

## Kameratilgang og lokal testing

- Bruk den publiserte HTTPS-adressen som en vanlig nettleserfane. Forhåndsvisning i andre apper og innebygde rammer kan blokkere tilgang. Nettstedet ber om tillatelse når du trykker **Åpne kamera**. Hvis tilgangen er avslått, bruk nettstedets kamerainnstillinger i Safari eller Chrome. Sjekk også telefonens innstillinger for kameratilgang hvis nettleseren fortsatt er blokkert.
- Appen ber eksplisitt om et bakovervendt kamera. Hvis nettleseren ikke finner et som oppfyller forespørselen, vises en feilmelding. På telefoner med flere baklinser velger nettleseren linsen.
- For lokal testing på en datamaskin med Python 3, åpne terminalen i appmappen og kjør `python3 -m http.server 8000 --bind 127.0.0.1`. Åpne `http://localhost:8000/`. Kamera krever fremdeles et tilgjengelig bakovervendt kamera. HTTP via maskinens lokale IP-adresse regnes vanligvis ikke som en sikker kontekst på telefonen. Bruk GitHub Pages til mobiltesten.
- Appen frigir kameraet når siden skjules. Sporet ligger i minnet så lenge siden er lastet. Lagre PNG før siden lukkes eller lastes inn på nytt.

[Dokumentasjon for kameratilgang og sikre kontekster](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

## Hvordan sporet bygges

Appen leser opptil omtrent 15 nye videobilder per sekund og skalerer det sentrerte kvadratet til 640 × 640. Et piksel passerer hvis den vektede lysstyrken når terskelen. For et piksel som passerer, beholder appen den høyeste verdien som er sett i hver RGB-kanal. Gløden legges til ved visning og eksport, slik at den kan justeres uten å endre det lagrede sporet.

## Test glød og RGB-sporing i v0.2

- Bruk **Lysstyrke** for å slippe inn hele RGB-pikselet når den vektede lysstyrken når terskelen. Bruk **RGB-kanaler** for å slippe inn rød, grønn og blå separat. Dette gir en mettet rød eller blå LED mulighet til å tegne spor selv når den vektede lysstyrken er lav.
- Hold telefonen stødig og prøv en rød, grønn og blå lyskilde i et mørkt rom. Begynn med terskel 145. Nullstill før du bytter sporingsmodus for å sammenligne samme motiv fra tomt lerret. Endring av sporingsmodus og terskel gjelder kommende videobilder.
- Sett **Glødstyrke** til 0 % for å se selve sporet. Øk styrken og sammenlign **Glødspredning** ved 8 og 30 px. Spredningen angir omtrentlig radius for hvert av de to uskarphetstrinnene i eksportbildet. Begge glødinnstillingene oppdaterer også et stoppet spor og tas med i neste PNG.
- For å oppdatere det eksisterende `ledtrace`-prosjektet kan du erstatte `index.html`, `style.css`, `app.js` og `image.js` på `main` i én endring. Når Pages har publisert, åpne samme prosjektadresse og sjekk at appen viser **V0.3**.

**Teststatus:** Skrivebords-Chrome med simulert video og mobilbredde bekreftet kant-til-kant-kamera, kontroller oppå bildet, innstillingspanel, sporing og PNG-eksport. Brukeren har prøvd v0.1 på iPhone med Safari. Fysisk testing av v0.3 gjenstår på iPhone Safari og Android Chrome.

## Mobilvisning i v0.3

Kamerabildet fyller hele nettleserens synlige område, med kameravalg øverst og kontroller nederst. Nettleserens egne adresselinjer styres av nettleseren. Åpne **Innstillinger** for terskel, RGB-valg og glød. Panelet kan lukkes mens sporingen pågår. Den stiplede rammen markerer det sentrerte kvadratutsnittet der kanten er synlig. På noen skjermer kan deler av kvadratet ligge utenfor den kant-til-kant-visningen. **Lysspor** viser hele kvadratet som lagres i PNG.
