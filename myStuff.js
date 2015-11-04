var myCampaigns = function(){
	db.user.findOne({where: {id: 4}}).then(function(user){
		user.getCampaigns().then(function(campaigns){
			return campaigns
		});
	});
};
