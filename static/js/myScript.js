var editCard = function(cardId) {
    $(cardId + ' .edit').on('click', function(e){
    e.preventDefault();
    $(cardId + ' input, textarea').prop('readonly', false);
    $(cardId + ' select').attr('disabled', false);
    $(cardId + ' .edit').toggleClass('hidden');
    $(cardId + ' .saveChanges').toggleClass('hidden');   
    });          
};

var saveCard = function(cardId) {
    $(cardId + ' .save').on('click', function(e){
    //e.preventDefault();
    $(cardId + ' input, textarea').prop('readonly', true);
    $(cardId + ' select').attr('disabled', true);
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
    editCard('#noteInfo');
    saveCard('#noteInfo');
    editCard('#characterCampaign');
    saveCard('#characterCampaign');

    $('.user-pic').tooltip();

    $('.login-form').on('submit', function(e) {
        e.preventDefault();
        $.post( "/login", $(this).serialize(), function(data) {
            if (data == 'PASS') {
                console.log('passed');
                window.location.replace("/create");            
            } else {
            /*   Simulate error message from the server   */
                 shakeModal();
            };
        });
    });

    $('.put-form').on('submit', function(e){
        e.preventDefault();
        var myUrl = $(this).attr('action');
        var myData = $(this).serialize()
        $.ajax({
            method:'PUT',
            url:myUrl,
            data:myData
        }).done(function(){
            if ($(this).attr('id', 'addCharacter') || $(this).attr('id', 'removeCharacter')) {
                window.location.replace("");
            }
        });
    });

    $('#campaignLink').popover()

});