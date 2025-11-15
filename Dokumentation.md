# Vad gör tjänsten?

AI TripBooker är en researetjänst som använder OpenAI:s GPT-modell 3.5 för att skapa personaliserade reseförslag och detaljerade reseplaner. Tjänsten kombinerar AI-genererade rekommendationer med en traditionell bokningsplattform för upplevelser i Bulgarien.

# Huvudfunktioner

- AI-drivna reseförslag - Få personaliserade rekommendationer baserat på userns input - destination, intressen och budget
- Upplevelsebokning - Boka rekommenderade upplevelser och paket
- Användarhantering - Personliga konton för att göra bokningar

# Målgrupp

Primär målgrupp är resenärer som planerar semester eller weekendresor till Bulgarien
Sekundär målgrupp är personer som vill ha AI-assistans för reseplanering.

# Avvägningar om etik och säker användning

# Etiska överväganden

AI-transparens: Användare informeras tydligt om att rekommendationer genereras av AI och bör verifieras med andra källor. AI-förslag presenteras som rekommendation och inte planering.

Datahantering: Användardata som destination, intressen och budget används endast för att generera rekommendationer och lagras säkert. Ingen personlig information delas med tredje part.

Bias och rättvisa: AI-modellen kan ha inneboende bias. Jag har inte kontroll över modellen och kan endast erbjuda mångsidiga reseförslag som inkluderar olika typer av upplevelser och budgetalternativ för att motverka potentiell snedvridning mot bäst marknadsförda förslag online.

Användning av ChatGPTs AI språkmodell assistans vid implementering av API modellen i projektet och förbättring av dokumentation på ett proffesionell nivå.

# Säkerhetsåtgärder

API-säkerhet: OpenAI API-nycklar lagras säkert på servern och exponeras aldrig i frontend-kod. Alla AI-anrop sker via autentiserade backend-endpoints.

Användarautentisering: JWT-baserad autentisering med bcrypt-hashade lösenord. Sessioner löper ut automatiskt för att minimera säkerhetsrisker.

Inputvalidering: Grundläggande validering på både frontend (required-fält, minlängd) och backend (kontroll av obligatoriska fält) för att säkerställa datakvalitet. Prisma ORM ger skydd mot SQL-injection.

CORS-skydd: Konfigurerat för att endast tillåta förfrågningar från auktoriserade domäner och förhindra cross-origin attacker.
