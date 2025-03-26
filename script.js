let url = 'https://api.open-meteo.com/v1/forecast?latitude=43.8631&longitude=5.4284&daily=weather_code,wind_direction_10m_dominant,sunrise,sunset&hourly=temperature_2m&current=temperature_2m,is_day,wind_speed_10m,wind_direction_10m,weather_code,precipitation,snowfall&timezone=auto'
fetch(url)
  .then(function (response) {
    return response.json();
  })
  .then(function (donnees) {
    console.log(donnees);
    afficherMeteo(donnees);
  })
    /*.catch(function (erreur) {
        console.log(erreur);
        document.createElement("resultat").innerText = "Erreur de chargement.";

    })*/;

function afficherMeteo(donnees) {
  afficherDate(donnees);
  afficherTemperature(donnees);
  afficherJourNuit(donnees);
  afficherVent(donnees);
  afficherPrevisions(donnees);
  afficherMeteoHeure(donnees);
}

function afficherDate(donnees) {
  let dateElement = document.querySelector('.date-heure');
  let today = donnees.current.time;
  let date = new Date(today);
  let dateLocale = date.toLocaleDateString("fr-FR", {
    weekday: "long", day: "2-digit", month: "2-digit"
  });
  let now = new Date();
  let heureLocale = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  dateElement.innerHTML = `<p> ${dateLocale}</p>
                           <p>${heureLocale}</p>`;
  console.log("Date affichée :", dateElement.textContent);
}

function afficherTemperature(donnees) {

  let temperature = document.querySelector(".temperature");
  let weatherCode = donnees.current.weather_code;
  let codeMeteo = '';
  let bgImg = '';

  if (weatherCode === 0) {
    codeMeteo = 'assets/images/soleil.png';
    bgImg = 'assets/images/sun.jpg'
  } else if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) {
    codeMeteo = 'assets/images/nuage.png';
    bgImg = 'assets/images/cloud.jpg'
  } else if ([51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {//on met includes pour pas faire une ligne de 3km
    codeMeteo = 'assets/images/averse.png';
    bgImg = 'assets/images/rain.jpg'
  } else if ([95, 96, 99].includes(weatherCode)) {
    codeMeteo = 'assets/images/orage.png';
  } else {
    console.log("drole de temps");
  }
  let contenu = ` <div class="temps-du-jour">
                            <img src=${codeMeteo} alt="" >
                         </div>
                         <span class="big">${donnees.current.temperature_2m} ${donnees.current_units.temperature_2m}</span>`
  temperature.innerHTML += contenu;
  console.log(temperature.textContent);

  document.querySelector(".bgImg").style.backgroundImage = `url(${bgImg})`;
}

function afficherJourNuit(donnees) {

  let dayNight = document.querySelector(".jour-nuit");
  if (donnees.current.is_day === 1) {
    dayNight.innerHTML += '<img src="assets/images/jour.png" alt="Soleil">';
  } else {
    dayNight.innerHTML += '<img src="assets/images/nuit.png" alt="Lune">';
  }

  console.log(dayNight.innerHTML);
}

function afficherVent(donnees) {
  let ventElement = document.querySelector(".vent");
  let contenu = `<div class="direction">
                    <img src="assets/images/compass-arrow.png" alt="Fleche du vent">
                  </div>
                  <img src="assets/images/compass.png" alt="direction du vent">
                  <div class="force">
                      <p>${donnees.current.wind_speed_10m} ${donnees.current_units.wind_speed_10m}</p>
                  </div>`;
  ventElement.innerHTML += contenu;
  let direction = document.querySelector(".direction");
  direction.style.transform = `rotate(${donnees.current.wind_direction_10m}deg)`;
}

function afficherPrevisions(donnees) {
  let previsions = document.querySelector(".prevision");

  previsions.innerHTML += "";

  let daily = donnees.daily;
  let nbJours = daily.time.length;

  for (let i = 0; i < nbJours; i++) {

    let dateISO = daily.time[i];
    let codeMeteoWeek = daily.weather_code[i];
    let codeMeteoIcon = '';
    if (codeMeteoWeek === 0) {
      codeMeteoIcon = 'assets/images/soleil-mini.png';
    } else if (codeMeteoWeek === 1 || codeMeteoWeek === 2 || codeMeteoWeek === 3) {
      codeMeteoIcon = 'assets/images/nuage-mini.png';
    } else if ([51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82].includes(codeMeteoWeek)) {//on met includes pour pas faire une ligne de 3km
      codeMeteoIcon = 'assets/images/averse-mini.png';
    } else if ([95, 96, 99].includes(codeMeteoWeek)) {
      codeMeteoIcon = 'assets/images/orage-mini.png';
    } else {
      console.log("drole de temps");
    }

    let dateObj = new Date(dateISO);
    let dateLocale = dateObj.toLocaleDateString("fr-FR", {
      weekday: "long", day: "2-digit", month: "2-digit"
    });

    let dayHTML = `<div class="semaines">
                      <p class="date-jour">${dateLocale}</p>
                      <img class="icon-jour" src="${codeMeteoIcon}" alt="Icône météo" />
                    </div>`;

    previsions.innerHTML += dayHTML;
  }
}

function afficherMeteoHeure(donnees) {

  let container = document.querySelector(".flex");
  container.innerHTML = "";

  let horaires = donnees.hourly.time;
  let journee = horaires.slice(0,24);
  let temperatures = donnees.hourly.temperature_2m;
  let nbHeures = journee.length;

  for (let i = 0; i < nbHeures; i++) {
    let dateObj = new Date(horaires[i]);
    let heure = dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    let temperature = temperatures[i];
    
    let contenu = `
      <div class="heure-par-heure">
        <p class="heure">${heure}</p>
        <p class="temperature">${temperature} ${donnees.hourly_units.temperature_2m}</p>
      </div>
    `;

    container.innerHTML += contenu;
  }
}


