import './style.css';

const axios = require('axios').default;
axios.interceptors.request.use( x => {
  // to avoid overwriting if another interceptor
  // already defined the same object (meta)
  x.meta = x.meta || {}
  x.meta.requestStartedAt = new Date().getTime();
  return x;
})

axios.interceptors.response.use( x => {

  document.getElementById("resultInfos").innerHTML=  " ("+((new Date().getTime() - x.config.meta.requestStartedAt)/1000+ " secondes)");
      return x;
  },
  // Handle 4xx & 5xx responses
  x => {
    document.getElementById("resultInfos").innerHTML=  ((new Date().getTime() - x.config.meta.requestStartedAt)/1000+ " secondes");
    throw x;
  }
)



document.getElementById("resultSearch").style.display = "none"


document.getElementById("submitSearch").onclick = function(){

  let searchValue = document.getElementById("searchInput").value

  axios.get('http://localhost:4000?query='+searchValue)
    .then(function (response) {

      if(searchValue == "" || searchValue == null)
        return;

        document.getElementById("resultSearch").style.display = "block"      

      document.getElementById("resultInfos").innerHTML=  response.data.hits.hits.length+" résultats" + document.getElementById("resultInfos").innerHTML;

      if(response.data.hits.hits.length <= 0){
        document.getElementById("resultInfos").innerHTML +="<h3 class='text-center'>Aucun résultat pour la recherche : "+searchValue+"</h3>"
      }

      document.getElementById("results").innerHTML ="";
      response.data.hits.hits.forEach(result => {
        let indexOfResult = result._source.content.indexOf(searchValue);
        let content = result._source.content.substr(indexOfResult-20, 230).replace(new RegExp(searchValue,"g"), function (x) {
          return "<span class='find'>"+x+"</span>";
        }) + "...";
        if(result._source.author == null){
          result._source.author ="Inconnu"
        }
        document.getElementById("results").innerHTML += '<div class="result"><hr><h3>'+result._source.path.split(".")[0]+' <span class="author">par '+result._source.author+'</span> <span class="type">'+result._source.path.split(".")[1].toUpperCase()+'</span></h3><p>'+content+'</p><a href="#" class="btn">Voir le fichier</a></div>';
      })
      
    })
    .catch(function (error) {

      console.log(error);
    })
    .then(function () {

    });

}
