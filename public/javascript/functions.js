window.onload = function () {
  main();
}

function formatDateInput(f, fVal) {
  moment.locale('pt-br');
  if (f.value != '')
    document.getElementById(fVal).value = moment(f.value).format('YYYY-MM-DD');
}

function main() {
  selectMenu(window.location.pathname.split('/')[1]);
}

function selectMenu(path) {
  if (path != '') {
    let el = document.getElementsByClassName('current'+path)[0];
    console.log(el);
    el.classList.add('current');
    el.setAttribute('aria-current', 'page');
  }else if (path == ''){
    let el = document.getElementsByClassName('currenthome')[0];
    el.classList.add('current');
    el.setAttribute('aria-current', 'page');
  }
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

async function getAuthorsSelect(old, current) {
  let response;
  try {
    response = await axios.get('/autor/todos');
  } catch (error) {
    response = {};
    console.error(error);
  }
  let authors = response.data.authors;
  let authors_select = document.getElementById(current);
  authors.forEach(el => {
    let option = document.createElement("option");
    option.text = el.public_name;
    option.value = el._id;
    if (el._id == document.getElementById(old).value ) {
      option.selected = "selected";
    }
    authors_select.appendChild(option);
  });
}

async function getGenresSelect(old, current) {
  let response;
  try {
    response = await axios.get('/genero/todos');
  } catch (error) {
    response = {};
    console.error(error);
  }
  let genres = response.data.genres;
  let genres_select = document.getElementById(current);
  genres.forEach(el => {
    let option = document.createElement("option");
    option.text = el.description;
    option.value = el._id;
    if (el._id == document.getElementById(old).value ) {
      option.selected = "selected";
    }
    genres_select.appendChild(option);
  });
}

async function getTypesSelect(old, current) {
  let response;
  try {
    response = await axios.get('/tipo/todos');
  } catch (error) {
    response = {};
    console.error(error);
  }
  let types = response.data.types;
  let types_select = document.getElementById(current);
  types.forEach(el => {
    let option = document.createElement("option");
    option.text = el.description;
    option.value = el._id;
    if (el._id == document.getElementById(old).value ) {
      option.selected = "selected";
    }
    types_select.appendChild(option);
  });
}
