import './style.css';

const axios = require('axios').default;
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

axios.interceptors.request.use((x) => {
  // to avoid overwriting if another interceptor
  // already defined the same object (meta)
  x.meta = x.meta || {};
  x.meta.requestStartedAt = new Date().getTime();
  return x;
});

axios.interceptors.response.use(
  (x) => {
    document.getElementById('resultInfos').innerHTML =
      ' (' +
      ((new Date().getTime() - x.config.meta.requestStartedAt) / 1000 +
        ' secondes)');
    return x;
  },
  // Handle 4xx & 5xx responses
  (x) => {
    document.getElementById('resultInfos').innerHTML =
      (new Date().getTime() - x.config.meta.requestStartedAt) / 1000 +
      ' secondes';
    throw x;
  }
);



document.getElementById('resultSearch').style.display = 'none';

document.getElementById('submitSearch').onclick = function () {

  let searchValue = document.getElementById('searchInput').value;
  const path = `/api?query=` + searchValue;
  console.log(path);

  axios
    .get(path)
    .then(function (response) {

      if (searchValue == '' || searchValue == null) return;

      document.getElementById('resultSearch').style.display = 'block';

      document.getElementById('resultInfos').innerHTML =
        response.data.length +
        ' résultats' +
        document.getElementById('resultInfos').innerHTML;

      if (response.data.length <= 0) {
        document.getElementById('resultInfos').innerHTML +=
          "<h3 class='text-center'>Aucun résultat pour la recherche : " +
          searchValue +
          '</h3>';
      }

      document.getElementById('results').innerHTML = '';

      var id = 0;

      response.data.forEach((result) => {
        
        if (result.author == null) {
          result.author = 'Inconnu';
        }
        var extension = result.path.split(".")[result.path.split(".").length-1].toUpperCase();
        var title = result.path.split("/")[result.path.split("/").length-1].replace('.'+extension.toLowerCase(), '');

        document.getElementById("results").innerHTML += '<div class="result" id="result_'+id+'"><hr><h3>'+title+' <span class="author">par '+result.author+'</span> <span class="type">'+extension+'</span></h3><p>'+result.content+'</p><a class="btn link" download="'+result.path.split("/")[result.path.split("/").length-1]+'">Télécharger le fichier</a></div>';
        
        id++;
      })
      var els = document.getElementsByClassName("link");

      Array.prototype.forEach.call(els, function(el) {
        el.onclick= function(){download(el.getAttribute("download"))}
      });

    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {});
};

function download(name){
      axios.get(`${FILE_PATH}:${FILE_PORT}/${name}`,
        {
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/pdf'
            }
        })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name); //or any other extension
            document.body.appendChild(link);
            link.click();
        })
        .catch((error) => console.log(error));


  }
