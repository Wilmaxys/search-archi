import './style.css';
const axios = require('axios').default;

document.getElementById("resultSearch").style.display = "none"

document.getElementById("submitSearch").onclick = function(){




  let searchValue = document.getElementById("searchInput").value


  axios.get('http://localhost:4000?query='+searchValue)
    .then(function (response) {
      if(searchValue == "" || searchValue == null)
      return;
  
      document.getElementById("resultInfos").innerHTML=  response.hits.hits.length+" résultats ("+response.took/1000+ " secondes)"
      document.getElementById("results").innerHTML ="";
      response.hits.hits.forEach(result => {
        document.getElementById("resultSearch").style.display = "block"      
        let indexOfResult = result._source.content.indexOf(searchValue);
        let content = result._source.content.substr(indexOfResult-130, 230).replace(new RegExp(searchValue,"g"), function (x) {
          return "<span class='find'>"+x+"</span>";
        }) + "...";
        document.getElementById("results").innerHTML += '<div class="result"><hr><h3>'+result._source.title+' <span class="author">par '+result._source.author+'</span> <span class="type">'+result._type+'</span></h3><p>'+content+'</p><a href="#" class="btn">Voir le fichier</a></div>';
      })
      
    })
    .catch(function (error) {

      console.log(error);
    })
    .then(function () {

    });



}
