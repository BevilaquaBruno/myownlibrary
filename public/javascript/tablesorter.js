var TableSorter = {
    makeSortable: function(table, evt){
        // Store context of this in the object
        let _this = this;
        let th = table.tHead, i;
        th && (th = th.rows[0]) && (th = th.cells);
        if (th){
            i = th.length;
        }else{
            return; // if no `<thead>` then do nothing
        }
        // Loop through every <th> inside the header
        while (--i >= 0) (function (i) {
            let dir = 1;

            // Append click listener to sort
            th[i].addEventListener('click', function () {
                _this._sort(table, i, (dir = 1 - dir), this);
            });
        }(i));
    },
    _sort: function (table, col, reverse, th) {
        let tb = table.tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
        tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
        i;
        reverse = -((+reverse) || -1);
        // Sort rows
        if (reverse > 0){
          if (document.getElementsByTagName('body')[0].classList[0] === 'dark') {
            th.innerHTML = th.innerText + '<img style="width: 15px; margin-left: 7px;" src="/public/imgs/arrow_down_white.svg">';
          }else{
            th.innerHTML = th.innerText + '<img style="width: 15px; margin-left: 7px;" src="/public/imgs/arrow_down_black.svg">';
          }
        }else if(reverse < 0){
          if (document.getElementsByTagName('body')[0].classList[0] === 'dark') {
            th.innerHTML = th.innerText + '<img style="width: 15px; margin-left: 7px;" src="/public/imgs/arrow_up_white.svg">';
          }else{
            th.innerHTML = th.innerText + '<img style="width: 15px; margin-left: 7px;" src="/public/imgs/arrow_up_black.svg">';
          }
        }
        tr = tr.sort(function (a, b) {
            // `-1 *` if want opposite order
            return reverse * (
                // Using `.textContent.trim()` for test
                a.cells[col].textContent.trim().localeCompare(
                    b.cells[col].textContent.trim()
                )
            );
        });
        for(i = 0; i < tr.length; ++i){
            // Append rows in new order
            tb.appendChild(tr[i]);
        }
    }
}
