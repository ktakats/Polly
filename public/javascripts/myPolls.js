$(document).ready(function(){

  var address="/polls";
  var mainDiv=document.getElementById("polls");

  $.get(address, function(data){
    data.forEach(function(poll){
      var q=document.createElement("a");
      q.href="polls/"+poll.id;
      var qdiv=document.createElement("div");
      qdiv.setAttribute("class", "btn btn-default poll-div");
      qdiv.innerHTML=poll.question;
      q.appendChild(qdiv);
      q.appendChild(document.createElement("br"));
      mainDiv.appendChild(q);
    });
  });
});
