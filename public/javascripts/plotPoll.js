var id;
var voted;
$(document).ready(function(){

  var address="/polls"+window.location.pathname;
  id=address.slice(12)
//  console.log(address)
  var voted=false;

  // Get data
  getData(address);
  // First allow to vote
});

function createHeader(question, owner){
  var place=document.getElementById("header");
  var Q=document.createElement("h4");
  Q.innerHTML=question;
  Q.setAttribute("class", "title")
  var owns=document.createElement("h8");
  owns.innerHTML="created by "+owner;
  owns.setAttribute("class", "createdby")
  place.appendChild(Q);
  place.appendChild(owns);
}

// creates the for to vote from the details of the poll
function createForm(data, options, votes){
  var place=document.getElementById("poll");
  var form=document.createElement("form");
  form.setAttribute("method", "post")
  form.setAttribute("action","/polls"+id)
  form.id="vote"
  place.appendChild(form)

  options.forEach(function(item,i){
  //  console.log(item)

    var inputsect=document.createElement("input");
    inputsect.type="radio";
    inputsect.name="vote";
    inputsect.id=i;
    inputsect.value=item;

    var label=document.createElement("label")
    label.setAttribute("for", inputsect.id)
    label.innerHTML=item;
    var span=document.createElement("span");
    span.appendChild(document.createElement("span"))
    label.appendChild(span)
    form.appendChild(inputsect)
    form.appendChild(label)
    form.appendChild(document.createElement("br"))


  })

  var sub=document.createElement("input")
  sub.setAttribute("type", "submit")
  sub.setAttribute("class", "btn btn-default")
  sub.setAttribute("value", "Vote")
  form.appendChild(sub)
};

//Gets the details of the poll from the database and calls plot
function getData(address){

  $.get(address, function(data){
    //  console.log(data)
      var question=data.question;
      var owner=data.createdBy.username;
      createHeader(question, owner);
    var options=$.map(data.answers, function(value, index){
      return value.option;
    })
    var votes=$.map(data.answers, function(value, index){
      return value.votes;
    })

    var voters=$.map(data.voters, function(value, index){
      return value.ip;
    });

    console.log(voters);

    $.getJSON('http://ipinfo.io', function(ipdata){
      console.log(ipdata.ip)
      console.log($.inArray(ipdata.ip,voters))
      if($.inArray(ipdata.ip, voters)>0){
        console.log("bla");
        voted=true;
      }
      if(!voted){
        console.log(voted)
        createForm(data,options,votes)
      }
      else{
        var all=votes.reduce(function(a, b) {return a + b;}, 0);
        if(all!=0){
          plot(data, votes, all);
        }
        else{
          document.getElementById("plot").innerHTML="No votes yet"
        }
      }
    })

  //    console.log(options)
  //    console.log(votes)




  });
}

//submits form
$("form").submit(function(e) {
    e.preventDefault(); // Prevents the page from refreshing
    var $this = $(this); // `this` refers to the current form element
//    $.getJSON('http://ipinfo.io', function(data){
//      $this.append('<input type="text" name="ip" value='+data.ip+'/>');
//      console.log($this)
//    })
//    .done(function(){
      $.post(
          $this.attr("action"), // Gets the URL to sent the post to
          $this.serialize(), // Serializes form data in standard format
          "json" // The format the response should be in
      )
      .done(function(){
        $('#vote')[0].reset();
        voted=true;
        getData(address);
  //    })
    })
  //  $.post(
  //      $this.attr("action"), // Gets the URL to sent the post to
  //      $this.serialize(), // Serializes form data in standard format
  //      "json" // The format the response should be in
  //  );
  //  $('#vote')[0].reset();
  //  voted=true;
  //  getData(address);
});



//plotting
function plot(data, votes, all){


//  var data=votes;
  var dat=data.answers;

  var canvas=d3.select("#plot").append("svg")
    .attr("width", 1000)
    .attr("height", 1000);

//var color=d3.scale.ordinal()
//    .domain([0, votes.length])
//    .range(["red", "blue"]);
var color = d3.scale.category20();

var group= canvas.append("g")
    .attr("transform", "translate(500,200)");

var r=200;
var p=Math.PI *2;

var arc=d3.svg.arc()
    .innerRadius(0)
    .outerRadius(r)

var pie=d3.layout.pie()
    .value(function(d){return d.votes/all})
    .startAngle(0)
    .endAngle(p)
    .sort(null);

var arcs=group.selectAll(".arc")
    .data(pie(dat))
    .enter()
    .append("g")
    .attr("class", "arc")

arcs.append("path")
    .attr("d", arc)
    .attr("fill", function(d,i){return color(i)})
    .transition()
      //.delay(function(d,i){return i*500;})
      .duration(500)
    .attrTween("d", function(d){
      //console.log(d)
      var i=d3.interpolate(d.startAngle+0.1,d.endAngle);
      return function(t){
        d.endAngle=i(t);
        return arc(d);
      }
    })

arcs.append("text")
    .attr("transform", function(d){return "translate("+arc.centroid(d) + ")";})
    .attr("text-anchor", "middle")
    .attr("font-size", "1.5em")
    .transition()
    .delay(500)
    .text(function(d){if(d.data.votes>0){return d.data.option;}})

}