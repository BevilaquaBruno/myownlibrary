function formatDateInput(f, fVal) {
  moment.locale('pt-br');
  if (f.value != '')
    document.getElementById(fVal).value = moment(f.value).format('YYYY-MM-DD');
}
