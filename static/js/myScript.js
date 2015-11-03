var editCard = function(cardId) {
    $(cardId + ' .edit').on('click', function(e){
    e.preventDefault();
    $(cardId + ' input, textarea').prop('readonly', false);
    $(cardId + ' .edit').toggleClass('hidden');
    $(cardId + ' .saveChanges').toggleClass('hidden');   
    });          
};

var saveCard = function(cardId) {
    $(cardId + ' .save').on('click', function(e){
    //e.preventDefault();
    $(cardId + ' input, textarea').prop('readonly', true);
    $(cardId + ' .edit').toggleClass('hidden');
    $(cardId + ' .saveChanges').toggleClass('hidden');
    }); 
};

$(document).ready(function(){
    editCard('#characterInfo');
    saveCard('#characterInfo');
    editCard('#campaignInfo');
    saveCard('#campaignInfo');
    editCard('#campaignLocation');
    saveCard('#campaignLocation');
    editCard('#accountInfo');
    saveCard('#accountInfo');

    $('.put-form').on('submit', function(e){
        e.preventDefault();
        var myUrl = $(this).attr('action');
        var myData = $(this).serialize()
        $.ajax({
            method:'PUT',
            url:myUrl,
            data:myData
        }).done(function(){
            //do stuff when the put action is complete
            //probably just redirect
        });
    });
});