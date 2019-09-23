$(document).ready(function () {
    $('.delete-details').on('click', function (e) {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/' + id,
            success: function () {
                alert('Deleting Article');
                window.location.href = '/api/patients';
            },
            error: function (err) {
                console.log(err);
            }
        });
    });
});