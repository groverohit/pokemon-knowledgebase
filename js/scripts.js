(function(){

  var pokemonRepository = (function(){

  //an array containing pokemon obects with name, height and types
  var pokemonList = [];

  //the modal container
  var modalContainer = $('#modal-container');

  //function to show the modal
  function showModal(title, text, url){
    var modal = $('.modal');
    var closeButton = $('.modal-close');

    //show pokemon name, height and image in modal
    $('.modal-title').get(0).innerHTML = title;
    $('.modal-text').get(0).innerHTML = "Height = " + text;
    $('.modal-image').get(0).innerHTML = '<img src="' + url + '"/>';
    $('#modal-container').addClass('is-visible');

    //event listener to hide modal on button click
    $('.modal-close').on('click', hideModal);
  }

  //function to hide the modal
  function hideModal(){
    var modalContainer = $('#modal-container');
    $('#modal-container').removeClass('is-visible');
  }

  //function to log selected pokemon details from the url
  function showDetails(pokemon){
    loadDetails(pokemon).then(function() {
    showModal(pokemon.name, pokemon.height, pokemon.imageUrl);
    });
  }

  //function addListItem to add pokemons as list
  function addListItem(pokemon){
    var list = $('.pokemon-list');
    var listItem = $('li');
    var button = $('<button class="button-class">'+pokemon.name+'</button>');
    $('.pokemon-list').append($('li')).append(button);

    //event listener for button clicks
    button.on('click', function(event){
      showDetails(pokemon);
    });
  }

  //function to add pokemons to array
  function add(pokemon){
    pokemonList.push(pokemon);
  }

  //function to return pokemons list
  function getAll(){
    return pokemonList;
  }

  //function to load list of pokemons from the url with name and url
  function loadList() {
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    return $.ajax(apiUrl, {dataType: 'json'}).then(function(responseJSON) {
      responseJSON.results.forEach(function(item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
    });
  }).catch(function(e) {
      console.log(e);
    });
  }

  //function to get pokemon details
  function loadDetails(pokemon) {
    return $.ajax(pokemon.detailsUrl, {dataType: 'json'}).then(function(responseJSON) {
      pokemon.imageUrl = responseJSON.sprites.front_default;
      pokemon.height = responseJSON.height;
    }).catch(function(e) {
      console.error(e);
    });
  }

  //addEventListener for "Escape" key on the modal
  $(document).keyup(function( event ) {
  if (event.keyCode === 27 && $('#modal-container').hasClass('is-visible')) {
    hideModal();
  }
});

  //function to close the modal if user clicks on overlay
  $('#modal-container').on('click', (e) => {
  var target = $(e.target);
  if (target.is ('#modal-container')) {
    hideModal();
    }
  });

  //make functions accessible from outside the object
  return{
    add: add,
    getAll: getAll,
    loadList: loadList,
    loadDetails: loadDetails,
    addListItem: addListItem,
    showDetails: showDetails,
    showModal: showModal,
    hideModal: hideModal
  }
})();

//call loadList function
pokemonRepository.loadList().then(function(){
  //add each pokemon as list item
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
})();
