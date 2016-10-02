var address='/polls';
console.log(address)
$(document).ready(function(){

  $.get(address, function(data){
    var mainDiv=document.getElementById("polls");
    data.forEach(function(poll){
      if(poll.owner){
        //row
        var rowdiv=document.createElement("div");
        rowdiv.setAttribute("class", "row");
        rowdiv.id="row"+poll.id;
        //column
        var leftcol=document.createElement("div");
        leftcol.setAttribute("class","col-md-4 col-xs-2 col-md-offset-4 col-xs-offset-4");
        var rightcol=document.createElement("div");
        rightcol.setAttribute("class","col-md-4 col-xs-6 text-left");
        //question div
        var q=document.createElement("a");
        q.href="polls/"+poll.id;
        var qdiv=document.createElement("div");
        qdiv.setAttribute("class", "btn btn-default polldiv poll-div");
        qdiv.innerHTML=poll.question;
        //delete button
        var delbtn=document.createElement("button");
        delbtn.setAttribute("class", "btn btn-danger delbtn");
        delbtn.id=poll.id
        delbtn.innerHTML="Delete";
        //add results button
        var resultsbtn=document.createElement("button");
        resultsbtn.setAttribute("class", "btn btn-default resultbtn");
        resultsbtn.id=poll.id;
        resultsbtn.innerHTML="Results"
        //append
        q.appendChild(qdiv);
        rightcol.appendChild(delbtn);
        rightcol.appendChild(resultsbtn);
        //q.appendChild(document.createElement("br"));
        leftcol.appendChild(q);
        rowdiv.appendChild(leftcol);
        rowdiv.appendChild(rightcol);
        mainDiv.appendChild(rowdiv);
      }
    });
  });

    $(document).on("click", ".delbtn", function(e){
      e.preventDefault();
      var confirmation=confirm("Are you sure you want to delete this poll?")
      if(confirmation){
        var todel="#row"+$(this)[0].id;
        $.ajax({
          url: 'polls/'+$(this)[0].id,
          type: 'DELETE',
          success: function(resp){
            $(todel).remove();
          }
        });
      }
    });

    $(document).on("click", ".resultbtn", function(e){
      e.preventDefault();
      window.location.href='polls/polls/'+$(this)[0].id;
    });

});
