function formatDateInput(f, fVal) {
  moment.locale('pt-br');
  if (f.value != '')
    document.getElementById(fVal).value = moment(f.value).format('YYYY-MM-DD');
}

async function getLanguagesSelect(old, current) {
  let response;
  try {
    response = await axios.get('/idioma/todos');
  } catch (error) {
    response = {};
    console.error(error);
  }
  let languages = response.data.languages;
  let languages_select = document.getElementById(current);
  languages.forEach(el => {
    let option = document.createElement("option");
    option.text = el.description;
    option.value = el._id;
    if (el._id == document.getElementById(old).value ) {
      option.selected = "selected";
    }
    languages_select.appendChild(option);
  });
}

async function getCountriesSelect(old, current) {
  let response;
  try {
    response = await axios.get('/pais/todos');
  } catch (error) {
    response = {};
    console.error(error);
  }
  let countries = response.data.countries;
  let countries_select = document.getElementById(current);
  countries.forEach(el => {
    let option = document.createElement("option");
    option.text = el.name;
    option.value = el._id;
    if (el._id == document.getElementById(old).value ) {
      option.selected = "selected";
    }
    countries_select.appendChild(option);
  });
}

async function getPublishersSelect(old, current) {
  let response;
  try {
    response = await axios.get('/editora/todos');
  } catch (error) {
    response = {};
    console.error(error);
  }
  let publishers = response.data.publishers;
  let publishers_select = document.getElementById(current);
  publishers.forEach(el => {
    let option = document.createElement("option");
    option.text = el.name;
    option.value = el._id;
    if (el._id == document.getElementById(old).value ) {
      option.selected = "selected";
    }
    publishers_select.appendChild(option);
  });
}
