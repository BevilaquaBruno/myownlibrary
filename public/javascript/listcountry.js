window.onload = function() {
  main();
  getDataForTableCountry();
}

function getDataForTableCountry() {
  let data = getDataForTable('/pais/todos');
  data.then(dt => {
    let html = '';
    dt.forEach(el => {
      html += '<tr><td>'+el.name+'</td>';
      html += '<td class="u-center-text"><a title="Editar País" href="/pais/atualizar/'+el._id+'" class="btn btn-green btn-small"><img src="/public/imgs/pencil.svg"></a>&nbsp;';
      html += '<a title="Excluir País" href="/pais/excluir/'+el._id+'" class="btn btn-red btn-small"><img src="/public/imgs/trash.svg"></a></td>';
      html += '<td style="display: none;">'+el._id+'</td></tr>';
    });
    document.getElementById('tableCountryBody').innerHTML = html;
  });
  TableSorter.makeSortable(document.getElementById('tableCountry'));
}
