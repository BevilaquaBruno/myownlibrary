window.onload = function () {
  main();
}

function main() {
  selectMenu(window.location.pathname.split('/')[1]);
  verifyAlert('mainAlert');
  changeThemeBody(true);
}

function changeThemeBody(init = false){
  let sun = '/public/imgs/sun.svg';
  let moon = '/public/imgs/moon.svg';
  let bd = document.getElementsByTagName('body')[0];
  if (init === false) {
    bd.classList.toggle('dark');
    bd.classList.toggle('light');
  }
  clist = bd.classList[0] || 'light';
  if (clist === 'dark')
    document.getElementById('spanChangeTheme').innerHTML = '<img src="'+sun+'">';
  else
    document.getElementById('spanChangeTheme').innerHTML = '<img src="'+moon+'">';
  axios.get('/setTheme/'+clist);
}

function formatDateInput(f, fVal) {
  moment.locale('pt-br');
  if (f.value != '')
    document.getElementById(fVal).value = moment(f.value).format('YYYY-MM-DD');
}

function verifyAlert(id) {
  if (document.getElementById(id)?.style?.display === 'none' && document.getElementById(id)?.innerHTML != '') {
    _('mainAlert').fade('in', 500);
    let tmt = timeout(5500);
    tmt.then(()=>{
      _('mainAlert').fade('out', 1000);
    });
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function selectMenu(path) {
  if (path != '') {
    let el = document.getElementsByClassName('current'+path)[0];
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
  let countries = response.data.data;
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
  let publishers = response.data.data;
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
  let authors = response.data.data;
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
  let genres = response.data.data;
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
  let types = response.data.data;
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

async function getDataForTable(url) {
  try {
    response = await axios.get(url);
  } catch (error) {
    response = {}.
    console.error(error);
  }
  let data = response.data.data;
  return data;
}

function _(el) {
  if (!(this instanceof _)) {
    return new _(el);
  }
  this.el = document.getElementById(el);
}

_.prototype.fade = function fade(type, ms) {
  var isIn = type === 'in',
    opacity = isIn ? 0 : 1,
    interval = 50,
    duration = ms,
    gap = interval / duration,
    self = this;

  if(isIn) {
    self.el.style.display = 'inline';
    self.el.style.opacity = opacity;
  }

  function func() {
    opacity = isIn ? opacity + gap : opacity - gap;
    self.el.style.opacity = opacity;

    if(opacity <= 0) self.el.style.display = 'none'
    if(opacity <= 0 || opacity >= 1) window.clearInterval(fading);
  }

  var fading = window.setInterval(func, interval);
}
