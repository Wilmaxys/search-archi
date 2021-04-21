import './style.css'
const axios = require('axios').default;

document.getElementById("submitSearch").onclick = function(){


  var json = require('./test.json')
  document.getElementById("resultInfos").innerHTML=  json.hits.hits.length+" résultats ("+json.took/1000+ " secondes)"
  document.getElementById("results").innerHTML ="";
  json.hits.hits.forEach(response => {

    document.getElementById("results").innerHTML += '<div class="result"><hr><h3>1-Guerre de Canudos.pdf</h3><p>Le fondateur de ladite communauté, Antônio Conselhei-ro,prophète millénariste <span>ambulant</span>, prêchait une moraled’abstinence et considérait la...</p></div>';

  })

  axios.get('http://localhost:8081/test')
    .then(function (response) {
      // handle success
            


    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });

}