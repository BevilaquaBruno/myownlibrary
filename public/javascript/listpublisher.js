window.onload = function() {
  main();
  getDataForTablePublisher();
}

function getDataForTablePublisher() {
  let data = getDataForTable('/editora/todos');
  data.then(dt => {
    let html = '';
    dt.forEach(el => {
      html += '<tr><td>'+el.name+'</td>';
      html += '<td>'+el.country_id.name+'</td>';
      html += '<td class="u-center-text"><a title="Editar Editora" href="/editora/atualizar/'+el._id+'" class="btn btn-green btn-small"><img src="/public/imgs/pencil.svg"></a>&nbsp;';
      html += '<a title="Excluir Editora" href="/editora/excluir/'+el._id+'" class="btn btn-red btn-small"><img src="/public/imgs/trash.svg"></a></td>';
      html += '<td style="display: none;">'+el._id+'</td></tr>';
    });
    document.getElementById('tablePublisherBody').innerHTML = html;
  });
  TableSorter.makeSortable(document.getElementById('tablePublisher'));
}
