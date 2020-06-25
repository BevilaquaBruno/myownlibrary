window.onload = function () {
  getLanguages();
  getCountries();
}

async function getLanguages() {
  let response;
  try {
    response = await axios.get('/idioma/todos');
  } catch (error) {
    response = {};
    console.error(error);
  }
  let languages = response.data.languages;
  let languages_select = document.getElementById('language_id');
  languages.forEach(el => {
    let option = document.createElement("option");
    option.text = el.description;
    option.value = el._id;
    if (el._id == document.getElementById('old_language_id').value ) {
      option.selected = "selected";
    }
    languages_select.appendChild(option);
  });
}

async function getCountries() {
  let response;
  try {
    response = await axios.get('/pais/todos');
  } catch (error) {
    response = {};
    console.error(error);
  }
  let countries = response.data.countries;
  let countries_select = document.getElementById('country_id');
  countries.forEach(el => {
    let option = document.createElement("option");
    option.text = el.name;
    option.value = el._id;
    if (el._id == document.getElementById('old_country_id').value ) {
      option.selected = "selected";
    }
    countries_select.appendChild(option);
  });
}
