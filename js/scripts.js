(function() {
  var pokemonRepository = (function() {
    //an array containing pokemon obects with name, height and types
    var pokemonList = [];

    //function to log selected pokemon details from the url
    function showDetails(pokemon) {
      loadDetails(pokemon).then(function() {
        $('.modal-title').html(pokemon.name);
        $('.pokemon-height').html('Height = ' + pokemon.height);
        $('.pokemon-types').html('Types = ' + pokemon.types.join(', '));
        $('.pokemon-abilities').html(
          'Abilities = ' + pokemon.abilities.join(', ')
        );
        $('.image1').attr('src', pokemon.imageUrl);
        $('.image2').attr('src', pokemon.backImageUrl);
      });
    }

    //function addListItem to add pokemons as list
    function addListItem(pokemon) {
      var button = $(
        '<button class="button-class list-group-item list-group-item-action btn btn-primary" data-toggle="modal" data-target="#pokemon-modal">' +
          pokemon.name +
          '</button>'
      );
      $('.list-group').append(button);

      //event listener for button clicks
      button.on('click', function() {
        showDetails(pokemon);
      });
    }

    //function to add pokemons to array
    function add(pokemon) {
      pokemonList.push(pokemon);
    }

    //function to return pokemons list
    function getAll() {
      return pokemonList;
    }

    //function to load list of pokemons from the url with name and url
    function loadList() {
      var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
      return $.ajax(apiUrl, { dataType: 'json' })
        .then(function(responseJSON) {
          responseJSON.results.forEach(function(item) {
            var pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
          });
        })
        .catch(function(e) {
          /* eslint-disable no-console */
          console.error(e);
          /* eslint-enable no-console */
        });
    }

    //function to get pokemon details
    function loadDetails(pokemon) {
      return $.ajax(pokemon.detailsUrl, { dataType: 'json' })
        .then(function(responseJSON) {
          pokemon.imageUrl = responseJSON.sprites.front_default;
          pokemon.height = responseJSON.height;
          pokemon.backImageUrl = responseJSON.sprites.back_default;
          pokemon.abilities = [];
          for (var i = 0; i < responseJSON.abilities.length; i++)
            pokemon.abilities.push(responseJSON.abilities[i].ability.name);

          pokemon.types = [];
          for (i = 0; i < responseJSON.types.length; i++)
            pokemon.types.push(responseJSON.types[i].type.name);
        })
        .catch(function(e) {
          /* eslint-disable no-console */
          console.error(e);
          /* eslint-enable no-console */
        });
    }

    //make functions accessible from outside the object
    return {
      add: add,
      getAll: getAll,
      loadList: loadList,
      loadDetails: loadDetails,
      addListItem: addListItem,
      showDetails: showDetails
    };
  })();

  //call loadList function
  pokemonRepository.loadList().then(function() {
    //add each pokemon as list item
    pokemonRepository.getAll().forEach(function(pokemon) {
      pokemonRepository.addListItem(pokemon);
    });
  });
})();
