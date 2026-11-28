# Complicated Time Peace – Mobile v1.4

En frittstående webapp for å lage lysspor med mobilens bakovervendte kamera. Appen er laget for Safari på iPhone og Chrome på Android. Den har ingen byggetrinn, avhengigheter, serverkode eller kobling til Raspberry Pi og Processing. Kameraet brukes uten mikrofon. Bildebehandling og PNG-eksport skjer i nettleseren. Kamerabilder lastes ikke opp.

## Publiser gratis med GitHub Pages

1. Pakk ut ZIP-filen. Opprett et nytt, separat **offentlig** GitHub-repositorium, for eksempel `complicated-time-peace-mobile`. Velg **Add a README file** ved opprettelse for å få en `main`-gren. Et offentlig repositorium kan bruke GitHub Pages med GitHub Free.
2. Velg **Add file → Upload files**. Last opp `index.html`, `style.css`, `app.js`, `image.js`, `manifest.webmanifest` og eventuelt denne README-filen i roten. Bruk innholdet i mappen, slik at `index.html` ligger på øverste nivå. Arkivet inkluderer også den skjulte filen `.nojekyll`. Du kan ta den med for å hoppe over Jekyll, men appen fungerer også uten den. Velg **Commit changes**.
3. Åpne **Settings → Pages**. Under **Build and deployment**, velg **Deploy from a branch**, deretter `main` og `/(root)`. Klikk **Save**.
4. Vent til **Settings → Pages** viser adressen. Åpne `https://BRUKERNAVN.github.io/complicated-time-peace-mobile/` direkte i Safari på iPhone eller Chrome på Android. Bruk adressen GitHub viser hvis den avviker. Slå på **Enforce HTTPS** hvis valget er tilgjengelig og ikke allerede aktivert.

[GitHubs veiledning for publisering fra en gren](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [HTTPS for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

## Test på begge telefonene

1. Trykk **Åpne kamera** og tillat tilgang. Kontroller at forhåndsvisningen kommer fra bakkameraet. Hold telefonen horisontalt og sikt inn motivet.
2. Trykk **Start sporing**. Beveg en liten lyskilde mot en mørk bakgrunn. Sporet skal bli liggende. Trykk **Kamera** for å sjekke utsnittet mens sporingen pågår, og **Lysspor** for å se resultatet.
3. Juster **Terskel**. En høyere verdi slipper inn færre og lysere piksler fra kommende kamerabilder. Nullstill mellom forsøk hvis du vil sammenligne terskelverdier fra samme utgangspunkt. Juster **Glød** og se effekten på det eksisterende sporet med en gang.
4. Trykk **Stopp sporing**. Beveg lyset og sjekk at sporet står stille. **Start sporing** fortsetter på samme spor. **Lukk kamera** frigir kameraet og beholder sporet.
5. Trykk **Lagre PNG**. Åpne den lagrede filen og kontroller at den inneholder hele lyssporet med valgt glød. Se i nettleserens nedlastinger. Hvis nettleseren åpner bildet, bruk nettleserens lagrings- eller delingsvalg.
6. Trykk **Nullstill** og kontroller at det gamle sporet forsvinner. Prøv også å avvise kameratilgang og gi tilgang på nytt via nettstedsinnstillingene. Bytt til en annen app og tilbake. Åpne kameraet igjen for å fortsette på samme spor hvis siden fortsatt er lastet.

## Kameratilgang og lokal testing

- Bruk den publiserte HTTPS-adressen som en vanlig nettleserfane. Forhåndsvisning i andre apper og innebygde rammer kan blokkere tilgang. Nettstedet ber om tillatelse når du trykker **Åpne kamera**. Hvis tilgangen er avslått, bruk nettstedets kamerainnstillinger i Safari eller Chrome. Sjekk også telefonens innstillinger for kameratilgang hvis nettleseren fortsatt er blokkert.
- Appen ber eksplisitt om et bakovervendt kamera. Hvis nettleseren ikke finner et som oppfyller forespørselen, vises en feilmelding. På telefoner med flere baklinser velger nettleseren linsen.
- For lokal testing på en datamaskin med Python 3, åpne terminalen i appmappen og kjør `python3 -m http.server 8000 --bind 127.0.0.1`. Åpne `http://localhost:8000/`. Kamera krever fremdeles et tilgjengelig bakovervendt kamera. HTTP via maskinens lokale IP-adresse regnes vanligvis ikke som en sikker kontekst på telefonen. Bruk GitHub Pages til mobiltesten.
- Appen frigir kameraet når siden skjules. Sporet ligger i minnet så lenge siden er lastet. Lagre PNG før siden lukkes eller lastes inn på nytt.

[Dokumentasjon for kameratilgang og sikre kontekster](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

## Hvordan sporet bygges

Appen leser nye videobilder i takt med kameraet og beholder videobildets proporsjoner under sporing. PNG-eksporten beholder hele bredden og høyden til lyssporet. Et piksel passerer hvis den vektede lysstyrken når terskelen. For et piksel som passerer, beholder appen den høyeste verdien som er sett i hver RGB-kanal. Gløden legges til ved visning og eksport, slik at den kan justeres uten å endre det lagrede sporet.

## Test glød og RGB-sporing i v0.2

- Bruk **Lysstyrke** for å slippe inn hele RGB-pikselet når den vektede lysstyrken når terskelen. Bruk **RGB-kanaler** for å slippe inn rød, grønn og blå separat. Dette gir en mettet rød eller blå LED mulighet til å tegne spor selv når den vektede lysstyrken er lav.
- Hold telefonen stødig og prøv en rød, grønn og blå lyskilde i et mørkt rom. Begynn med terskel 145. Nullstill før du bytter sporingsmodus for å sammenligne samme motiv fra tomt lerret. Endring av sporingsmodus og terskel gjelder kommende videobilder.
- Sett **Glødstyrke** til 0 % for å se selve sporet. Øk styrken og sammenlign **Glødspredning** ved 8 og 30 px. Spredningen angir omtrentlig radius for hvert av de to uskarphetstrinnene i eksportbildet. Begge glødinnstillingene oppdaterer også et stoppet spor og tas med i neste PNG.
- For å oppdatere det eksisterende `ledtrace`-prosjektet kan du erstatte `index.html`, `style.css`, `app.js` og `image.js` og `manifest.webmanifest` på `main` i én endring. Når Pages har publisert, åpne samme prosjektadresse og sjekk at appen viser **V0.9**.

**Teststatus:** Skrivebords-Chrome med simulert video bekreftet at sporingen følger nye kamerabilder, myk terskel, RGB-sporing, glød, mobilvisning og PNG-eksport. Brukeren har prøvd v0.1 på iPhone med Safari. En test med simulert kamera bekreftet at lyssporet oppdateres oppå kamerabildet mens sporingen pågår, og vises alene ved stopp. I v0.9 bekreftet testen også at kamera og lysspor fyller samme flate under sporing, og at PNG-eksporten er kvadratisk. For v1.0 bekreftet Chrome-testen frostet bakgrunn, avrundede knapper, innstillingspanelet og full bredde under sporing. I v1.1 bekreftet Chrome-testen at menyen kan skjules og åpnes mens sporing pågår. Chrome-testen av v1.3 bekreftet at PNG-en beholder proporsjonene og lyssporet ved ytterkanten. I v1.4 bekreftet Chrome-testen at menyen er gjennomsiktig, at hovedknappene deler én rad og at sporing og PNG-eksport fungerer. Fysisk testing av v1.4 gjenstår på iPhone Safari og Android Chrome.

## Mobilvisning i v0.3

Kamerabildet fyller hele nettleserens synlige område, med kameravalg øverst og kontroller nederst. Nettleserens egne adresselinjer styres av nettleseren. Åpne **Innstillinger** for terskel, RGB-valg og glød. Panelet kan lukkes mens sporingen pågår. **Lysspor** viser hele sporet som lagres i PNG.

## Jevnere spor i v0.4

Appen ber om 30 kamerabilder i sekundet og bruker nye bilder etter hvert som nettleseren leverer dem. Faktisk hastighet avhenger av mobil, lys og kamera. Maksimum beholdes for hver kanal, slik at sporet blir liggende. En myk overgang over terskelen demper piksler nær terskelen. Faste lysspor tegnes bare på nytt når de har endret seg eller du justerer gløden.

Sammenlign ved å holde mobilen stødig og bevege en liten LED i en jevn bue, først sakte og så raskt. Se etter avstand mellom segmentene og harde kanter. Prøv med glød på 0 % først, slik at du ser selve sporet. Prøv samme motiv med vanlig romlys og svakere lys. Kameraet kan levere færre bilder i mørket.

## Automatisk vidvinkel i v0.5

Når du trykker **Åpne kamera**, prøver appen 0,6× hvis nettleseren tilbyr den innstillingen. Appen viser **0,6× aktiv** først når kameraet rapporterer innstillingen tilbake. Hvis nettleseren i stedet tilbyr et eget ultravidvinkelkamera med gjenkjennelig navn, velger appen det og viser **Ultravidvinkel aktiv**. Bildevinkelen kan avvike fra 0,6× i Kamera-appen. Ellers åpnes vanlig bakkamera med en statusmelding. Nettappen er avhengig av hvilke linser og zoomverdier nettleseren gir tilgang til.

Sjekk statusmeldingen på iPhone rett etter åpning. Rett kameraet mot samme motiv som i Kamera-appen med 0,6× og sammenlign bildevinkel og om kamerafeilen er borte.

## Åpne ledtrace uten adresselinje på iPhone

1. Hvis GitHub allerede viser v0.5, erstatt `index.html` og legg til `manifest.webmanifest` i roten av `piten/ledtrace`. Fra eldre versjoner, oppdater også `app.js`, `image.js` og `style.css`.
2. Åpne den publiserte siden i Safari. Velg **Del → Legg til på Hjem-skjerm**. Slå på **Åpne som nettapp** hvis valget vises, og trykk **Legg til**.
3. Start **ledtrace** fra ikonet på Hjem-skjermen. Trykk **Åpne kamera** og gi tilgang hvis du blir spurt.
4. Sjekk at Safari-adresselinjen er borte. iPhone kan fortsatt vise systemets statuslinje og hjemindikator.

[Apples veiledning](https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios)

## Lyssporet vises live i v0.8

Trykk **Start sporing** for å se lyssporet bygge seg opp direkte oppå kamerabildet. **Lysspor** viser sporet alene underveis. **Kamera** viser det over kamerabildet igjen. **Stopp sporing** viser sporet alene, klart for PNG-eksport.

Fra v0.7 erstatter du `index.html`, `app.js` og `style.css` i roten av GitHub-prosjektet.

## Full bredde under sporing i v0.9

Kamera og lysspor dekker samme flate under opptak. Appen bruker hele videobildet til sporing og skjuler den stiplede rammen mens du sporer. Skjermens visning følger kamerautsnittet med samme kant-til-kant-beskjæring som før start. I v0.9 brukte PNG-en fortsatt det sentrerte kvadratet.

Fra v0.8 erstatter du `index.html`, `app.js` og `style.css`. Sjekk at det står **V0.9** øverst.

## Oppdater til v1.0

Fra v0.9 erstatter du `index.html`, `app.js` og `style.css` i GitHub-prosjektet. Menyene har fått en frostet, gjennomsiktig bakgrunn, og knappene har fått større, avrundede trykkflater. Åpne **Innstillinger** for terskel, RGB og glød. Bruk appen fra Hjem-skjermen på iPhone for visning uten Safari-adresselinje.

## Kompakt visning i v1.1

Åpne kameraet og trykk **Skjul meny**. **Start/Stopp sporing** og **Nullstill** ligger igjen sammen med en liten knapp som åpner menyen. Bruk den for å finne **Lagre PNG**, kameravalg og innstillinger igjen.

For visning uten Safari-adresselinjen åpner du den publiserte siden i Safari og velger **Del → Legg til på Hjem-skjerm**. Slå på **Åpne som nettapp** hvis valget vises. Start fra ikonet på Hjem-skjermen. Safari styrer adresselinjen når du bruker en vanlig fane.

Fra v1.0 erstatter du `index.html`, `app.js` og `style.css` i GitHub-prosjektet.

## Liggende mobilvisning i v1.2

Hold telefonen horisontalt. I stående visning får du beskjed om å snu den. Hvis telefonen ikke roterer, deaktiver stående retningslås på mobilen. Når du snur mobilen til stående under sporing, stopper sporingen og lyssporet beholdes. Snu tilbake og trykk **Start sporing** for å fortsette. Kamera og sporing startes med hvert sitt trykk.

Fra v1.1 erstatter du `index.html`, `app.js` og `style.css` i GitHub-prosjektet.

## PNG i hele kamerabredden i v1.3

**Lagre PNG** eksporterer lyssporet i samme proporsjoner som kameravideoen. Hele sporet og gløden blir med, også utenfor området som kan være beskåret i kant-til-kant-visningen. Lengste side er opptil 800 piksler. Kamerabildet brukes til å sikte og se sporet live.

Fra v1.2 erstatter du `index.html`, `app.js` og `style.css`.

## Kompakte menyer i gråtoner i v1.4

Mobilmenyen har to rader. **Innstillinger** åpnes over menyen. **Skjul meny** gir den minste visningen. Kamerabildet og lyssporet vises fortsatt med farger.

Fra v1.3 erstatter du `index.html` og `style.css`.
