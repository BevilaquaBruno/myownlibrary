window.onload = function() {
  main();
  getDataForTableType();
}

function getDataForTableType() {
  let data = getDataForTable('/tipo/todos');
  data.then(dt => {
    let html = '';
    dt.forEach(el => {
      html += '<tr><td>'+el.description+'</td>';
      html += '<td class="u-center-text"><a title="Editar Tipo" href="/tipo/atualizar/'+el._id+'" class="btn btn-green btn-small"><img src="/public/imgs/pencil.svg"></a>&nbsp;';
      html += '<a title="Excluir Tipo" href="/tipo/excluir/'+el._id+'" class="btn btn-red btn-small"><img src="/public/imgs/trash.svg"></a></td></tr>';
    });
    document.getElementById('tableTypeBody').innerHTML = html;
  });
}
