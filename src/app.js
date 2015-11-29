/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');

var serverUrl = 'http://drunkards.duckdns.org';

var main = new UI.Card({
  title: 'Tiny Drunkard',
  subtitle: 'Time to get drunk!',
  body: 'Press any button to report drank drinks.'
});

main.show();

main.on('click', function(e) {
  ajax({
    url: serverUrl + '/drunkards',
    method: 'get',
    type: 'json',
    async: false,
    cache: true
  }, function gotDrunkards(drunkards) {
    var drunkardSection = {
      title: 'Select drunkard',
      items: []
    };
    
    drunkards.forEach(function addDrunkardItem(drunkard) {
      drunkardSection.items.push({
        title: drunkard.name
      });
    });
    
    var drunkardMenu = new UI.Menu({
      sections: [drunkardSection]
    });

    drunkardMenu.on('select', function(e) {
      var selectedDrunkard = drunkards[e.itemIndex];
      ajax({
        url: serverUrl + '/drinks',
        method: 'get',
        type: 'json',
        async: false,
        cache: true
      }, function gotDrinks(drinks) {
        var drinkSection = {
          title: 'Select drink',
          items: []
        };
        
        drinks.forEach(function addDrinkItem(drink) {
          drinkSection.items.push({
            title: drink.name
          });
        });
        
        var drinkMenu = new UI.Menu({
          sections: [drinkSection]
        });
    
        drinkMenu.on('select', function(e) {
          var selectedDrink = drinks[e.itemIndex];
          ajax({
            url: serverUrl + '/dranks',
            method: 'post',
            type: 'json',
            async: false,
            cache: false,
            data: {
              drinkId: selectedDrink.id,
              drunkardId: selectedDrunkard.id
            }
          }, function postDone() {
            drinkMenu.hide();
            drunkardMenu.hide();
            main.show();
          });
        });
    
        drinkMenu.show();
      });
    });

    drunkardMenu.show();
  });
  
});