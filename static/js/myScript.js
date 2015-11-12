var editCard = function(cardId) {
    $(cardId + ' .edit').on('click', function(e){
    e.preventDefault();
    $(cardId + ' input').prop('readonly', false);
    $(cardId + ' textarea').prop('readonly', false);
    $(cardId + ' select').attr('disabled', false);
    $(cardId + ' .edit').toggleClass('hidden');
    $(cardId + ' .saveChanges').toggleClass('hidden');   
    });          
};

var saveCard = function(cardId) {
    $(cardId + ' .save').on('click', function(e){
    //e.preventDefault();
    $(cardId + ' input').prop('readonly', true);
    $(cardId + ' textarea').prop('readonly', true);
    $(cardId + ' select').attr('disabled', true);
    $(cardId + ' .edit').toggleClass('hidden');
    $(cardId + ' .saveChanges').toggleClass('hidden');
    }); 
};

var realTimeEdit = function(inputId) {
    $(inputId).change(function() {
        $(inputId + 'Card').html($(inputId).val());
    });
};

var realTimeGenderEdit = function(inputId) {
    $(inputId).change(function() {
        if ($(this).val().toLowerCase() == 'female') {
            $(inputId + 'Card').html('<i class="pe-7s-female"></i>');
        } else {
            $(inputId + 'Card').html('<i class="pe-7s-male"></i>');
        };
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

    realTimeEdit('#newCharacterName');
    realTimeEdit('#newCharacterRace');
    realTimeEdit('#newCharacterClass');
    realTimeEdit('#newCharacterHealth');
    realTimeEdit('#newCharacterDefense');
    realTimeEdit('#newCharacterExp');
    realTimeEdit('#newCharacterGold');
    realTimeGenderEdit('#newCharacterGender');

    $('#campaignLink').popover();
    $('.user-pic').tooltip();

    $('.login-form').on('submit', function(e) {
        e.preventDefault();
        $.post( "/login", $(this).serialize(), function(serverResponse) {
            if (serverResponse == 'HTTP/1.1 200 OK') {
                window.location.replace("/create");            
            } else {
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
        }).success(function(){
            window.location.reload();
        });
    });

    $("#signupForm").validate();

});