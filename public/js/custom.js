$(function () {
    $('#search').keyup(function () {

        let search_term = $(this).val();

        $.ajax({
            method: 'POST',
            url: '/patients/search',
            data: {
                search_term
            },
            dataType: 'json',
            success: function (json) {
                let data = json.hits.hits.map(function (hit) {
                    return hit;
                });

                $('#searchResults').empty();
                for (let i = 0; i < data.length; i++) {
                    let html = "";
                    html += '<blockquote class="blockquote mb-0">';
                    html += '<h5 class="card-title"> <a href="/patients/view/' + id + '" class="font-weight-bold">';
                    html += ' ' + name + ' | ' + hospital + ' </a></h5>';
                    html += '<footer class="blockquote-footer">';
                    html += '<cite title="' + category._id + '" > ' + category.name + '</cite></footer>';
                    html += '</blockquote>';
                    html += '<span class="badge badge-default badge-pill"><a href="/patients/' + id + '"class="btn btn-secondary"> <i class="fas fa-edit"></i></a><button class="btn btn-danger" data-toggle="modal" data-target=".bs-example-modal-sm"><i class="fas fa-times"></i></button></span></li>';
                    html += '<div class="modal bs-example-modal-sm" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-body"><i class="fa fa-question-circle"></i> Are you sure you want to delete thispatient?</div><div class="modal-footer"><form method="POST" action="/patients/' + id + '?_method=DELETE"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button><button class="btn btn-danger" type="submit" name="submit">Yes</button></form></div></div></div></div>';

                    $('#searchResults').append(html);
                }
            },

            error: function (error) {
                console.log(error);
            }
        });
    });
});