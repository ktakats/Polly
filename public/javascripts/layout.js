$(document).ready(function(){

	$(document).on('click','.signup-tab',function(e){
		e.preventDefault();
	    $('#registertaba').tab('show');
	});

	$(document).on('click','.signin-tab',function(e){
	   	e.preventDefault();
	    $('#logintaba').tab('show');
	});

	$(document).on('click','.forgetpass-tab',function(e){
	 	e.preventDefault();
	   	$('#forgetpasstaba').tab('show');
	});



$("form").submit(function(e) {
    e.preventDefault();
    var $this = $(this);
    $.post(
        $this.attr("action"),
        $this.serialize(),
        "json"
    )
    .done(function(data){
			console.log(data)
			if(data.redirect==undefined){
				var newdiv=$(".alert")
				newdiv.css("display", "block")
				newdiv.html(data.message);
			}
			else{
      	document.location.href=data.redirect;
			}
    });
    $('#signup')[0].reset();
});

});
