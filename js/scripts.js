(function(){

  var pokemonRepository = (function(){

  //an array containing pokemon obects with name, height and types
  var pokemonList = [];

  //the modal container
  var modalContainer = $('#modal-container');

  //function to show the modal
  function showModal(pokemon){
    var modal = $('.modal');
    var closeButton = $('.modal-close');

    //show pokemon name, height and image in modal
    $('.modal-title').get(0).innerHTML = pokemon.name;
    $('.modal-text').get(0).innerHTML = "Height = " + pokemon.height;
    $('.modal-image').get(0).innerHTML = '<img src="' + pokemon.imageUrl + '">';
    $('.modal-types').get(0).innerHTML = 'Types are ' + pokemon.types;
    $('.modal-abilities').get(0).innerHTML = 'Abilities are ' + pokemon.abilities;
    $('.modal-back-image').get(0).innerHTML = '<img src="' + pokemon.backImageUrl + '"/>';
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
    showModal(pokemon);
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
      pokemon.backImageUrl = responseJSON.sprites.back_default;
      pokemon.abilities = [];
      for (var i = 0; i < responseJSON.types.length; i++)
        pokemon.abilities.push(responseJSON.abilities[i].ability.name);

      pokemon.types = [];
      for (var i = 0; i < responseJSON.types.length; i++)
        pokemon.types.push(responseJSON.types[i].type.name);
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
