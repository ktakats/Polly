var i=3;
var maxfields=10;
var next=3;

$(document).ready(function(){

  $("form").bind('ajax:complete', function(data){
    document.location.href=data.redirect;
  });



  $(document).on("click", ".btn-remove", function(e){
    e.preventDefault();
    var fieldNum=this.id.charAt(this.id.length-1);
    var fieldId="#option"+fieldNum;
    $(this).closest('.col-md-4').remove();
    $(fieldId).remove();
  });


  $(document).on("click", ".btn-add", function(e){
    e.preventDefault();
    var current=$('#optiondiv');
    /*Create new line*/
    var tocopy=$(this).parents(".col-md-4");
    var newEntry=$(tocopy).clone().appendTo(current);
    newEntry.find('input').attr("id","Option"+next).attr("placeholder","Option "+next);
    /*Change previous line*/
    $(this).removeClass("btn-default").addClass("btn-danger").removeClass('btn-add').addClass("btn-remove");
    $(this).children('i').removeClass("fa-plus").addClass("fa-minus");
    next+=1;

  });

});
